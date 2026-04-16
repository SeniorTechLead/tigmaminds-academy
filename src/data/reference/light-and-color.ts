import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'light-and-color',
  title: 'Light & Color',
  category: 'physics',
  tags: ['math'],
  keywords: ['rayleigh scattering', 'refraction', 'snells law', 'wavelength', 'electromagnetic spectrum', 'diffraction'],
  icon: '🌈',
  tagline: 'Why the sky is blue, sunsets glow orange, and rainbows have seven bands.',
  relatedStories: ['orange-sunsets-assam', 'the-girl-who-painted-rain', 'rainbow-fish', 'kingfisher-blue', 'stars-ziro-valley', 'golden-deer-of-kamakhya'],
  understand: [
    {
      title: 'What Is Light?',
      beginnerContent:
        'Light is a form of energy that travels in waves, much like ripples on a pond — except light waves are incredibly fast, moving at about 300,000 kilometres per second. What we call "visible light" is actually a tiny slice of a much larger electromagnetic spectrum that includes radio waves, microwaves, and X-rays. Each color of visible light has a different wavelength: red light has the longest waves (around 700 nanometres) and violet has the shortest (around 380 nanometres). When all these wavelengths reach your eyes together, your brain perceives them as white light. A glass prism can split white light into its component colors because each wavelength bends by a slightly different amount — this is the same principle behind every rainbow you have ever seen.',
      intermediateContent:
        'The speed of light in a vacuum is exactly **c = 299,792,458 m/s** (roughly 3 × 10⁸ m/s). The relationship between wavelength (λ), frequency (f), and speed is **c = λ × f**. For red light at 700 nm: f = 3×10⁸ / 700×10⁻⁹ = **4.29 × 10¹⁴ Hz** (429 trillion vibrations per second). For violet at 380 nm: f = **7.89 × 10¹⁴ Hz**. The electromagnetic spectrum is ordered by wavelength: radio waves (km) → microwaves (cm) → infrared (μm) → visible (400-700 nm) → ultraviolet (nm) → X-rays (pm) → gamma rays (fm). All travel at the same speed c in vacuum, but differ in wavelength and therefore energy: **E = hf**, where h = 6.626 × 10⁻³⁴ J·s is Planck\'s constant.',
      advancedContent:
        'Light exhibits **wave-particle duality** — it behaves as a wave (interference, diffraction) and as a particle (photoelectric effect, Compton scattering). Einstein showed in 1905 that light comes in discrete packets called **photons**, each carrying energy **E = hf = hc/λ**. A single red photon (700 nm) carries E = 6.626×10⁻³⁴ × 3×10⁸ / 700×10⁻⁹ = **2.84 × 10⁻¹⁹ J ≈ 1.77 eV**. The photoelectric effect — electrons ejected from metals only when light exceeds a threshold frequency — cannot be explained by wave theory alone. In quantum electrodynamics (QED), light is mediated by virtual photons exchanged between charged particles. QED predicts the electron\'s magnetic moment to 12 decimal places, making it the most precisely verified theory in physics.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'Light travels so fast that it could circle the Earth 7.5 times in a single second.',
            'The light reaching your eyes from the Sun is already about 8 minutes old — it left the Sun 150 million kilometres ago.',
            'Some animals, like mantis shrimp, can see ultraviolet and infrared light that is completely invisible to humans.',
          ],
        },
      },
    },
    {
      title: 'The Visible Spectrum',
      beginnerContent:
        'The visible spectrum runs from red through orange, yellow, green, blue, indigo, and violet — the classic "ROYGBIV" you may have memorised. Each color corresponds to a narrow range of wavelengths. Red sits at about 620-700 nm, orange at 590-620 nm, yellow at 570-590 nm, green at 495-570 nm, blue at 450-495 nm, and violet at 380-450 nm. Beyond violet lies ultraviolet light (which causes sunburn), and beyond red lies infrared (which you feel as heat). Our eyes contain special cells called cones that are sensitive to red, green, and blue wavelengths; the brain mixes signals from these three cone types to create every color you perceive, including colors like pink and brown that do not appear in the rainbow at all.',
      intermediateContent:
        'The energy of each color can be calculated from **E = hc/λ**. Red photon (700 nm): E = (6.626×10⁻³⁴ × 3×10⁸) / 700×10⁻⁹ = **2.84 × 10⁻¹⁹ J = 1.77 eV**. Violet photon (380 nm): E = **5.22 × 10⁻¹⁹ J = 3.26 eV** — nearly twice the energy of red. This is why UV light causes sunburn but red light does not: UV photons carry enough energy to break chemical bonds in DNA. The human eye\'s sensitivity peaks at **555 nm** (yellow-green), matching the Sun\'s peak emission wavelength. Cone cells respond to overlapping ranges: S-cones peak at ~420 nm (blue), M-cones at ~530 nm (green), L-cones at ~560 nm (red). Color perception is the brain\'s interpretation of the ratio of signals from these three types.',
      advancedContent:
        'The visible spectrum represents only **0.0035%** of the full electromagnetic spectrum. Color vision evolved because the Sun\'s blackbody spectrum (temperature ~5,778 K) peaks in the visible range, described by **Wien\'s displacement law**: λ_max = 2.898 × 10⁶ / T nm. The CIE 1931 chromaticity diagram maps all perceivable colors to a 2D space using **color matching functions** x̄(λ), ȳ(λ), z̄(λ) derived from human cone responses. **Metamerism** — different spectra appearing identical — occurs because our three cone types collapse an infinite-dimensional spectrum into just three numbers. Mantis shrimp, with 16 photoreceptor types, experience far less metamerism. Recent research on **tetrachromacy** suggests some humans carry a fourth cone type (peak ~midway between M and L cones), potentially perceiving ~100 million colors versus the typical ~1 million.',
      diagram: 'WavelengthSpectrum',
    },
    {
      title: 'Rayleigh Scattering — Why the Sky Is Blue',
      beginnerContent:
        'When sunlight enters the atmosphere, it collides with tiny gas molecules — mostly nitrogen and oxygen. These molecules are much smaller than the wavelength of visible light, so they scatter shorter wavelengths (blue and violet) far more strongly than longer wavelengths (red and orange). This process is called Rayleigh scattering, named after the British physicist Lord Rayleigh. The intensity of scattering is proportional to 1/wavelength^4, which means blue light (shorter wavelength) scatters roughly ten times more than red light. Although violet light scatters even more than blue, our eyes are less sensitive to violet, and some of it gets absorbed in the upper atmosphere, so the sky looks blue rather than violet.',
      intermediateContent:
        'The Rayleigh scattering intensity formula is **I ∝ 1/λ⁴**. Let\'s calculate the ratio: blue light (450 nm) vs red light (700 nm). Ratio = (700/450)⁴ = (1.556)⁴ = **5.86** — blue scatters nearly 6× more than red. For violet (380 nm) vs red: (700/380)⁴ = (1.842)⁴ = **11.5×** more scattering. The full formula includes particle size and number density: **I = I₀ × (8π⁴α²)/(λ⁴r²)**, where α is the molecular polarizability and r is the distance. The sky appears blue rather than violet because: (1) the Sun emits less violet than blue, (2) our S-cones are less sensitive to violet, and (3) ozone absorbs some violet. The combination makes the perceived sky color peak around 470-480 nm — a pure azure blue.',
      advancedContent:
        'Rayleigh scattering is the small-particle limit of the full **Mie scattering theory** (developed by Gustav Mie in 1908). The Mie solution solves Maxwell\'s equations for a plane wave incident on a dielectric sphere of arbitrary size. The key parameter is the **size parameter** x = 2πr/λ: when x << 1, Mie reduces to Rayleigh; when x ≈ 1, complex interference patterns emerge; when x >> 1, geometric optics takes over. The scattering cross-section in the Rayleigh regime is **σ = (8π/3)(2πr/λ)⁴ × r² × |(m²−1)/(m²+2)|²**, where m is the complex refractive index. This 1/λ⁴ dependence also explains why the setting Sun appears red (blue scattered away), why cigarette smoke appears blue when side-lit (Rayleigh from tiny particles), and why milk appears slightly blue when dilute (casein micelles scatter blue light). In astrophysics, Rayleigh scattering of starlight by interstellar dust causes **interstellar reddening** — distant stars appear redder than their true color.',
      diagram: 'RayleighScatteringDiagram',
    },
    {
      title: 'Why Sunsets Glow Orange and Red',
      beginnerContent:
        'At sunset, sunlight travels through a much thicker slice of atmosphere to reach your eyes compared to midday, when the Sun is directly overhead. During this longer journey, nearly all the blue and green light gets scattered away in other directions before it can reach you. What remains is the longer-wavelength light — reds, oranges, and deep yellows — which paints the sky in those warm colors. Dust, smoke, and moisture in the air can enhance the effect. In Assam, the sunsets over the Brahmaputra often glow a deep, vivid orange because the river valley traps a layer of humid air and fine particles that scatter away even more of the shorter wavelengths, leaving behind rich golds and crimsons.',
      intermediateContent:
        'The path length through the atmosphere at sunset can be calculated using the **airmass formula**: at zenith angle θ, the path length is roughly **X = X₀/cos θ** (for θ < ~75°). At the horizon (θ ≈ 90°), the path is about **38× longer** than at zenith due to atmospheric curvature. If blue light is scattered 6× more per unit distance than red (from the 1/λ⁴ law), then over 38× the distance, the transmitted blue intensity drops to **(1/6)³⁸** — essentially zero. Only red and orange survive. The **Beer-Lambert law** quantifies this: **I = I₀ × e^(−τ × X)**, where τ is the optical depth. For blue light, τ_blue ≈ 0.235 at sea level, so at airmass 38: I/I₀ = e^(−0.235 × 38) ≈ e^(−8.93) ≈ **0.00013** — only 0.013% of blue light gets through.',
      advancedContent:
        'Volcanic eruptions produce dramatic sunsets because they inject **sulfate aerosols** (0.1-1 μm diameter) into the stratosphere, where they persist for 1-3 years. These particles are in the Mie scattering regime and preferentially scatter forward, creating a bright, diffuse glow. After the 1991 Pinatubo eruption, global sunsets were vivid red-purple for two years, and global temperatures dropped ~0.5°C. The purple color at twilight (the "Belt of Venus") occurs because red sunset light illuminates high-altitude atmosphere that is also scattering blue — red + blue = purple. **Atmospheric optics** researchers use spectrophotometry to measure the solar spectrum at different zenith angles, fitting the data to Mie and Rayleigh models to retrieve aerosol size distributions. This technique, called **sun photometry** (used by NASA\'s AERONET network), provides real-time data on air quality, smoke transport, and volcanic aerosol loading worldwide.',
    },
    {
      title: 'Refraction — How Light Bends',
      beginnerContent:
        'When light passes from one medium to another — say from air into water, or from air into glass — it changes speed. This change in speed causes the light to bend, a phenomenon called refraction. The amount of bending depends on the wavelength: shorter wavelengths bend more than longer ones. This is why a prism splits white light into a rainbow, and why a straw in a glass of water appears to "break" at the surface. Refraction is also why a pool looks shallower than it really is, and why stars twinkle — pockets of warm and cool air in the atmosphere act like tiny, shifting lenses that refract starlight in constantly changing directions.',
      intermediateContent:
        '**Snell\'s Law** governs refraction: **n₁ sin θ₁ = n₂ sin θ₂**, where n is the refractive index (n_air ≈ 1.00, n_water = 1.33, n_glass ≈ 1.50, n_diamond = 2.42). Example: Light hits water at 45°. sin θ₂ = (1.00 × sin 45°) / 1.33 = 0.707/1.33 = 0.532, so θ₂ = **32.1°** — the light bends toward the normal. The refractive index also depends on wavelength (**dispersion**): for crown glass, n_red ≈ 1.514 and n_violet ≈ 1.532. This small difference causes a prism to spread white light into a spectrum. **Total internal reflection** occurs when light tries to go from a denser to a less dense medium at an angle greater than the **critical angle**: θ_c = arcsin(n₂/n₁). For glass-to-air: θ_c = arcsin(1/1.50) = **41.8°**. This is how optical fibres work — light bounces along the fibre with zero loss at each reflection.',
      advancedContent:
        'Snell\'s Law follows from **Fermat\'s principle of least time** — light takes the path that minimises travel time between two points. Since light moves slower in denser media (v = c/n), the optimal path involves bending at the interface. The **refractive index** is fundamentally n = c/v = √(εᵣμᵣ), linking optics to electromagnetism. In **metamaterials** with engineered negative refractive index (n < 0), light bends the "wrong" way — toward the same side of the normal. This enables **superlenses** that beat the classical diffraction limit (resolution ~λ/2), potentially imaging features smaller than the wavelength of light. Pendry (2000) showed theoretically that a slab of n = −1 material acts as a perfect lens. **Graded-index (GRIN) optics** use continuously varying n(r) to bend light along curved paths without any surface — the same principle behind atmospheric mirages, where temperature gradients create a refractive index gradient that curves light rays from the sky toward the ground.',
      diagram: 'LensRayDiagram',
    },
    {
      title: 'Types of Scattering',
      beginnerContent:
        'Rayleigh scattering is not the only way light interacts with particles. When particles are roughly the same size as the wavelength of light (like water droplets in a cloud), Mie scattering takes over. Mie scattering affects all wavelengths almost equally, which is why clouds appear white — every color scatters the same amount and recombines into white. A third type, Raman scattering, is much rarer and involves the light actually changing wavelength as it scatters, which scientists use to identify chemical compositions. Understanding which type of scattering is happening tells you about the size of the particles involved.',
      intermediateContent:
        'The type of scattering depends on the **size parameter** x = 2πr/λ (particle radius ÷ wavelength, scaled by 2π). When x << 1 (tiny particles), Rayleigh dominates with I ∝ 1/λ⁴. When x ≈ 1, Mie scattering produces complex angular patterns. When x >> 1 (large particles like raindrops), geometric optics applies. Cloud droplets (~10 μm radius) with visible light (~0.5 μm): x ≈ 2π × 10/0.5 ≈ **126** — deep in the Mie regime. Mie scattering at large x is roughly wavelength-independent, which is why clouds are white. The **Raman shift** Δν = ν_incident − ν_scattered is characteristic of each molecular bond: the C-H stretch in organic molecules shifts by ~2,900 cm⁻¹, the O-H stretch in water by ~3,400 cm⁻¹. This makes Raman spectroscopy a chemical fingerprint technique.',
      advancedContent:
        'Raman scattering (discovered by C.V. Raman, 1928, Nobel Prize 1930) involves **inelastic photon-phonon interaction**: the incident photon excites a molecular vibration, losing energy (**Stokes shift**) or gaining energy from an already-excited vibration (**anti-Stokes shift**). Only about 1 in 10⁷ photons undergoes Raman scattering — the rest scatter elastically (Rayleigh). **Surface-Enhanced Raman Spectroscopy (SERS)** uses metallic nanostructures to amplify the Raman signal by 10⁶-10¹⁰×, enabling single-molecule detection. The enhancement comes from **localized surface plasmon resonance** — the incident light excites collective electron oscillations in the metal nanoparticle, creating intense electromagnetic "hot spots." SERS is now used in forensics, medical diagnostics, and even art authentication. **Brillouin scattering** is a related phenomenon where light scatters from acoustic phonons (sound waves in the material), allowing measurement of elastic properties at the microscale.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match the scattering type to its description',
          pairs: [
            ['Rayleigh scattering', 'Particles much smaller than light wavelength — makes the sky blue'],
            ['Mie scattering', 'Particles similar in size to light wavelength — makes clouds white'],
            ['Raman scattering', 'Light changes wavelength during scatter — used to identify chemicals'],
            ['Refraction', 'Light bends when entering a new medium — splits white light into colors'],
          ],
        },
      },
    },
    {
      title: 'Color Mixing — Additive vs Subtractive',
      beginnerContent:
        'There are two fundamentally different ways to mix colors. Additive mixing applies to light: red, green, and blue light combine to make white, and are used in screens and projectors. Subtractive mixing applies to pigments and paints: cyan, magenta, and yellow pigments combine to absorb all wavelengths and produce black (in theory — in practice you get a muddy brown, which is why printers add a black cartridge). When you see a red flower, the pigments in the petals absorb every wavelength except red, which bounces back into your eyes. This distinction matters because mixing paints and mixing light produce completely different results — red and green paint make brown, but red and green light make yellow.',
      intermediateContent:
        'In **additive mixing**, the combined intensity adds up. An RGB screen uses three sub-pixels per pixel: each sub-pixel emits 0-255 levels of intensity. The color `rgb(255, 255, 0)` = red + green at full intensity = yellow. `rgb(0, 255, 255)` = green + blue = cyan. The total number of displayable colors is 256³ = **16,777,216**. In **subtractive mixing**, each pigment absorbs (subtracts) certain wavelengths. Cyan pigment absorbs red (passes green + blue). Magenta absorbs green (passes red + blue). Yellow absorbs blue (passes red + green). Cyan + Magenta + Yellow each absorb one primary — together they absorb all three = **black**. The relationship is: Cyan = White − Red, Magenta = White − Green, Yellow = White − Blue. CMY are the "complements" of RGB.',
      advancedContent:
        'Color science uses **CIE color spaces** for precise specification. The **CIE 1931 XYZ** space defines three "virtual" primaries that encompass all perceivable colors — no real RGB display can reproduce the full gamut. The **gamut** of a display (sRGB, Adobe RGB, DCI-P3) is the triangle formed by its three primaries within the CIE chromaticity diagram. sRGB covers ~35% of perceivable colors; DCI-P3 ~45%; Rec. 2020 ~76%. **Spectral rendering** in computer graphics simulates light transport at individual wavelengths rather than RGB triplets, correctly handling **dispersion** (prisms), **fluorescence** (UV → visible), and **metamerism** (spectrally different lights appearing the same color). Color management in printing uses **ICC profiles** that map device RGB/CMYK values to device-independent CIE Lab coordinates, ensuring a photo looks the same on screen and on paper — a problem that involves solving multidimensional lookup tables with thousands of calibration patches.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each color mixing type to its properties',
          pairs: [
            ['Additive (light)', 'Red + Green + Blue = White — used in screens and projectors'],
            ['Subtractive (pigment)', 'Cyan + Magenta + Yellow = Black — used in paints and printers'],
            ['RGB primary colors', 'Red, Green, Blue — the primaries for mixing light'],
            ['CMY primary colors', 'Cyan, Magenta, Yellow — the primaries for mixing pigments'],
          ],
        },
      },
    },
  ]
};
