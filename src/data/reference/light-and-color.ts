import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'light-and-color',
  title: 'Light & Color',
  category: 'physics',
  tags: ['math'],
  keywords: ['rayleigh scattering', 'refraction', 'snells law', 'wavelength', 'electromagnetic spectrum', 'diffraction', 'prism', 'rainbow', 'mie scattering', 'raman', 'color mixing', 'total internal reflection', 'fiber optics'],
  icon: '🌈',
  tagline: 'Why the sky is blue, sunsets glow orange, and rainbows have seven bands.',
  relatedStories: ['orange-sunsets-assam', 'the-girl-who-painted-rain', 'rainbow-fish', 'kingfisher-blue', 'stars-ziro-valley', 'golden-deer-of-kamakhya'],
  understand: [
    // ── Section 1: What Is Light? ─────────────────────────────
    {
      title: 'What Is Light?',
      diagram: 'WavelengthSpectrum',
      beginnerContent:
        'Light is a form of energy that travels in waves — like ripples on a pond, except light waves are incredibly fast, moving at about **300,000 kilometres per second**. That is fast enough to circle the Earth 7.5 times in a single second.\n\n' +
        'What we call "visible light" is a tiny slice of a much larger family called the **electromagnetic spectrum**. The full family includes radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, and gamma rays. The only difference between them is wavelength.\n\n' +
        '| Wave type | Wavelength | Everyday example |\n' +
        '|-----------|-----------|------------------|\n' +
        '| Radio waves | metres to kilometres | FM radio, TV broadcast |\n' +
        '| Microwaves | centimetres | Microwave oven, Wi-Fi |\n' +
        '| Infrared | micrometres (μm) | TV remote, body heat |\n' +
        '| **Visible light** | **400–700 nanometres** | **Everything you see** |\n' +
        '| Ultraviolet | 10–400 nm | Sunburn, sterilisation |\n' +
        '| X-rays | picometres | Medical imaging |\n' +
        '| Gamma rays | femtometres | Nuclear reactions |\n\n' +
        'Each color of visible light has a different wavelength. **Red** has the longest waves (~700 nm) and **violet** has the shortest (~380 nm). When all wavelengths reach your eyes together, your brain sees **white light**.\n\n' +
        '**Analogy:** Think of light like sound. Low-pitched sounds (like a drum) have long wavelengths; high-pitched sounds (like a whistle) have short wavelengths. Red light is the "bass note" and violet is the "high note" of the visible spectrum.\n\n' +
        '**Try the diagram above** — slide through the spectrum to see how wavelength, color, and frequency are connected.\n\n' +
        'The Brahmaputra\'s surface at midday looks almost white because sunlight reflecting off water contains all wavelengths mixed together. At sunset, only red and orange wavelengths survive the long journey through the atmosphere — painting the river in gold.',
      intermediateContent:
        'The speed of light in a vacuum is exactly **c = 299,792,458 m/s** (roughly 3 × 10⁸ m/s). The relationship between wavelength (λ), frequency (f), and speed is:\n\n' +
        '> **c = λ × f**\n\n' +
        '**Worked example — wavelength to frequency:**\n\n' +
        'Red light has λ = 700 nm = 700 × 10⁻⁹ m.\n\n' +
        '`f = c / λ = 3 × 10⁸ / 700 × 10⁻⁹ = 4.29 × 10¹⁴ Hz`\n\n' +
        'That is **429 trillion vibrations per second**.\n\n' +
        '| Color | Wavelength (nm) | Frequency (× 10¹⁴ Hz) | Energy per photon (eV) |\n' +
        '|-------|----------------|----------------------|------------------------|\n' +
        '| Red | 700 | 4.29 | 1.77 |\n' +
        '| Orange | 600 | 5.00 | 2.07 |\n' +
        '| Yellow | 580 | 5.17 | 2.14 |\n' +
        '| Green | 530 | 5.66 | 2.34 |\n' +
        '| Blue | 470 | 6.38 | 2.64 |\n' +
        '| Violet | 380 | 7.89 | 3.26 |\n\n' +
        'Notice the pattern: shorter wavelength → higher frequency → higher energy. Violet photons carry nearly **twice** the energy of red photons.\n\n' +
        'The energy of a photon is **E = hf = hc/λ**, where **h = 6.626 × 10⁻³⁴ J·s** is Planck\'s constant.\n\n' +
        '**Worked example — photon energy:**\n\n' +
        '`E (blue, 470 nm) = (6.626 × 10⁻³⁴ × 3 × 10⁸) / (470 × 10⁻⁹)`\n' +
        '`= 1.989 × 10⁻²⁵ / 4.70 × 10⁻⁷`\n' +
        '`= 4.23 × 10⁻¹⁹ J = 2.64 eV`\n\n' +
        'This is why UV light causes sunburn but red light does not — UV photons carry enough energy to break chemical bonds in DNA.',
      advancedContent:
        'Light exhibits **wave-particle duality** — it behaves as a wave (interference, diffraction) and as a particle (photoelectric effect, Compton scattering).\n\n' +
        '**The photoelectric effect** (Einstein, 1905): Light ejects electrons from a metal surface, but *only* if the light frequency exceeds a threshold — regardless of intensity. This is impossible under classical wave theory, which predicts that brighter light (any frequency) should eventually eject electrons.\n\n' +
        '**Einstein\'s explanation:** Light comes in discrete packets called **photons**, each with energy **E = hf**. A photon either has enough energy to liberate an electron or it doesn\'t.\n\n' +
        '| Metal | Work function φ (eV) | Threshold wavelength λ₀ (nm) | Color needed |\n' +
        '|-------|---------------------|------------------------------|-------------|\n' +
        '| Cesium | 2.1 | 590 | Yellow or shorter |\n' +
        '| Sodium | 2.3 | 539 | Green or shorter |\n' +
        '| Copper | 4.7 | 264 | UV only |\n' +
        '| Platinum | 5.6 | 221 | Deep UV only |\n\n' +
        '**Kinetic energy of ejected electron:** KE_max = hf − φ\n\n' +
        '**Worked example:** UV light at 200 nm hits sodium (φ = 2.3 eV).\n\n' +
        '`E_photon = hc/λ = 1240 eV·nm / 200 nm = 6.2 eV`\n' +
        '`KE_max = 6.2 − 2.3 = 3.9 eV`\n\n' +
        'In quantum electrodynamics (QED), light is mediated by virtual photons exchanged between charged particles. QED predicts the electron\'s magnetic moment to **12 decimal places**, making it the most precisely verified theory in physics.\n\n' +
        '| Theory | Year | Key prediction |\n' +
        '|--------|------|----------------|\n' +
        '| Newton\'s corpuscles | 1704 | Light is particles — explains reflection, fails at diffraction |\n' +
        '| Huygens\' waves | 1690 | Light is waves — explains diffraction, fails at photoelectric |\n' +
        '| Maxwell\'s EM theory | 1865 | Light is electromagnetic wave — predicts c = 1/√(ε₀μ₀) |\n' +
        '| Einstein\'s photons | 1905 | Light is quantised — E = hf |\n' +
        '| QED | 1948 | Light is exchange of virtual photons — 12-digit accuracy |',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'Light travels so fast it could circle the Earth 7.5 times in a single second.',
            'The light reaching your eyes from the Sun is already about 8 minutes old — it left the Sun 150 million km ago.',
            'Some animals, like mantis shrimp, can see ultraviolet and infrared light invisible to humans — they have 16 types of colour receptors (we have 3).',
            'The Hoolock gibbon in Assam\'s Hollongapar Gibbon Sanctuary uses dawn light to navigate through dense canopy — their eyes are optimised for the blue-shifted light of early morning.',
          ],
        },
      },
    },

    // ── Section 2: The Visible Spectrum ───────────────────────
    {
      title: 'The Visible Spectrum & Your Eyes',
      diagram: 'ActivityPrismDiagram',
      beginnerContent:
        'The visible spectrum runs from red through orange, yellow, green, blue, indigo, and violet — the classic **ROYGBIV** mnemonic. Each color occupies a narrow band of wavelengths.\n\n' +
        '| Color | Wavelength range (nm) | You see it in... |\n' +
        '|-------|----------------------|------------------|\n' +
        '| Red | 620–700 | Ripe tomatoes, brake lights |\n' +
        '| Orange | 590–620 | Marigold flowers, Assamese sunset |\n' +
        '| Yellow | 570–590 | Ripe bananas, muga silk |\n' +
        '| Green | 495–570 | Tea gardens of Upper Assam |\n' +
        '| Blue | 450–495 | Clear sky, kingfisher feathers |\n' +
        '| Indigo | 420–450 | Deep twilight sky |\n' +
        '| Violet | 380–420 | Some orchids, UV-reflecting flowers |\n\n' +
        'Beyond violet lies **ultraviolet** (UV) — invisible to us, but it causes sunburn. Beyond red lies **infrared** (IR) — invisible too, but you feel it as heat from a fire.\n\n' +
        '**How your eyes see color:**\n\n' +
        'Your retina has two types of light-detecting cells:\n\n' +
        '| Cell type | What it detects | When it works best |\n' +
        '|-----------|----------------|--------------------|\n' +
        '| **Rods** (~120 million) | Light/dark only, no color | Dim light (night vision) |\n' +
        '| **Cones** (~6 million) | Color — three types: red, green, blue | Bright light (day vision) |\n\n' +
        'Your brain mixes signals from all three cone types to create every color you perceive — including colors like **pink** and **brown** that don\'t appear in the rainbow at all.\n\n' +
        '**Prediction:** If you mix red and green light, what do you get? (Not brown like paint — *yellow*! Try it with the diagram above.)\n\n' +
        '**Silk and light:** The *muga* silk of Assam appears golden-yellow because the silk fibres reflect wavelengths in the 570–590 nm band while absorbing shorter and longer wavelengths. No other silk in the world has this natural golden sheen.',
      intermediateContent:
        '**Why does the eye peak at 555 nm (yellow-green)?**\n\n' +
        'The Sun is a blackbody radiator at ~5,778 K. **Wien\'s displacement law** gives the peak emission wavelength:\n\n' +
        '`λ_max = 2.898 × 10⁶ / T = 2.898 × 10⁶ / 5778 = 501 nm`\n\n' +
        'The Sun peaks in blue-green, and our eyes evolved peak sensitivity nearby at 555 nm — not a coincidence.\n\n' +
        '| Cone type | Peak sensitivity (nm) | Color perceived | % of total cones |\n' +
        '|-----------|---------------------|-----------------|------------------|\n' +
        '| S-cones (short) | ~420 | Blue | ~6% |\n' +
        '| M-cones (medium) | ~530 | Green | ~32% |\n' +
        '| L-cones (long) | ~560 | Red | ~62% |\n\n' +
        '**Color blindness** occurs when one cone type is missing or defective:\n\n' +
        '| Type | Missing/defective cone | Prevalence (males) | Colors confused |\n' +
        '|------|----------------------|-------------------|-----------------|\n' +
        '| Protanopia | L-cones (red) | ~1% | Red ↔ green |\n' +
        '| Deuteranopia | M-cones (green) | ~5% | Red ↔ green |\n' +
        '| Tritanopia | S-cones (blue) | ~0.01% | Blue ↔ yellow |\n\n' +
        '**Worked example — why a red flower looks black under blue light:**\n\n' +
        'The flower\'s pigment absorbs all wavelengths except red (620–700 nm). Under blue light (only 450–495 nm present), there is no red light to reflect. The flower reflects nothing → looks black.\n\n' +
        '**Why does the Assamese kingfisher (*masor-ola sorai*) appear vivid blue?** Not pigment — **structural color**. Nano-scale keratin structures in the feathers interfere constructively for blue wavelengths, like a natural diffraction grating. The blue changes slightly with viewing angle.',
      advancedContent:
        'The visible spectrum represents only **0.0035%** of the full electromagnetic spectrum. Why this particular window?\n\n' +
        '| Factor | How it selects visible light |\n' +
        '|--------|-----------------------------|\n' +
        '| Solar output | ~48% of solar energy falls in 400–700 nm |\n' +
        '| Atmospheric transparency | O₂, O₃, H₂O absorb UV; CO₂, H₂O absorb IR — visible passes through |\n' +
        '| Water transparency | Maximum transmission at 400–500 nm (life evolved in oceans) |\n' +
        '| Retinal chemistry | Rhodopsin absorbs optimally at ~500 nm |\n\n' +
        '**CIE 1931 chromaticity diagram:**\n\n' +
        'The CIE system maps all perceivable colors to a 2D space using **color matching functions** x̄(λ), ȳ(λ), z̄(λ) derived from human cone responses. Any color is specified by chromaticity coordinates (x, y):\n\n' +
        '`x = X/(X+Y+Z), y = Y/(X+Y+Z)`\n\n' +
        '| Color space | Gamut coverage | Used in |\n' +
        '|-------------|---------------|--------|\n' +
        '| sRGB | ~35% of perceivable | Standard monitors, web |\n' +
        '| Adobe RGB | ~50% | Photography |\n' +
        '| DCI-P3 | ~45% | Cinema, iPhone/Mac displays |\n' +
        '| Rec. 2020 | ~76% | HDR television |\n\n' +
        '**Metamerism** — different spectra appearing identical — occurs because three cone types collapse an infinite-dimensional spectrum into just three numbers. Two light sources can match under one illuminant but differ under another (the dress that looked "blue-black" or "white-gold" in 2015 went viral because of metamerism under ambiguous illumination).\n\n' +
        '**Tetrachromacy:** ~12% of women carry a fourth cone gene variant (peak between M and L cones). Some may perceive ~100 million colors versus the typical ~1 million, though functional tetrachromacy remains rare and debated.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each part of the eye to its role in color vision',
          pairs: [
            ['Rods', '~120 million cells for dim-light vision — no color, only light/dark'],
            ['L-cones', 'Peak at ~560 nm — detect red wavelengths (62% of all cones)'],
            ['M-cones', 'Peak at ~530 nm — detect green wavelengths (32% of all cones)'],
            ['S-cones', 'Peak at ~420 nm — detect blue wavelengths (6% of all cones)'],
          ],
        },
      },
    },

    // ── Section 3: Rayleigh Scattering ────────────────────────
    {
      title: 'Rayleigh Scattering — Why the Sky Is Blue',
      diagram: 'RayleighScatteringDiagram',
      beginnerContent:
        'When sunlight enters the atmosphere, it collides with tiny gas molecules — mostly nitrogen (N₂) and oxygen (O₂). These molecules are **much smaller** than the wavelength of visible light, so they scatter shorter wavelengths (blue, violet) far more strongly than longer wavelengths (red, orange).\n\n' +
        '**Analogy:** Imagine throwing a handful of pebbles at a fence. Small gaps between the slats let tiny pebbles through easily while blocking large ones. Similarly, tiny molecules interact more strongly with short-wavelength (small) light waves.\n\n' +
        'The scattering follows a powerful rule: **intensity ∝ 1/λ⁴**. This means:\n\n' +
        '| Color | Wavelength | Relative scattering |\n' +
        '|-------|-----------|--------------------|\n' +
        '| Red | 700 nm | 1× (baseline) |\n' +
        '| Orange | 600 nm | 1.8× |\n' +
        '| Yellow | 580 nm | 2.1× |\n' +
        '| Green | 530 nm | 3.0× |\n' +
        '| Blue | 470 nm | 4.9× |\n' +
        '| Violet | 380 nm | **11.5×** |\n\n' +
        'Blue scatters nearly **5 times** more than red. Violet scatters even more, but our eyes are less sensitive to violet, and some gets absorbed by ozone — so the sky looks **blue**, not violet.\n\n' +
        '**Check yourself:** If blue light scatters 5× more than red, why doesn\'t the sky look blue at sunset too? *(Hint: how far does the light travel through the atmosphere at sunset compared to midday?)*\n\n' +
        '**Altitude and sky color:** On clear winter mornings in Shillong (1,496 m altitude), the sky appears a deeper, more vivid blue than in the plains. Why? At higher altitude there is less atmosphere above you, so less multiple-scattering washes out the blue. The Khasi Hills offer some of the purest blue skies in India.',
      intermediateContent:
        '**The Rayleigh scattering formula:**\n\n' +
        '> **I ∝ (1 + cos²θ) / λ⁴**\n\n' +
        'where θ is the scattering angle (0° = forward, 90° = sideways, 180° = backward).\n\n' +
        '**Worked example — blue vs red scattering ratio:**\n\n' +
        '`Ratio = (λ_red / λ_blue)⁴ = (700/450)⁴ = (1.556)⁴ = 5.86`\n\n' +
        'Blue light scatters **5.86×** more than red per molecule encounter.\n\n' +
        '| Comparison | Wavelengths | Ratio (λ₁/λ₂)⁴ |\n' +
        '|-----------|------------|------------------|\n' +
        '| Blue vs Red | 450 vs 700 nm | 5.86× |\n' +
        '| Violet vs Red | 380 vs 700 nm | 11.5× |\n' +
        '| Green vs Red | 530 vs 700 nm | 3.04× |\n' +
        '| Blue vs Green | 450 vs 530 nm | 1.93× |\n\n' +
        'The full formula includes molecular properties:\n\n' +
        '**σ = (8π³/3) × (n²−1)²/(N²λ⁴)** — where n is refractive index of air, N is number density.\n\n' +
        '**Why the sky is blue, not violet** — three reasons:\n\n' +
        '| Factor | Effect |\n' +
        '|--------|--------|\n' +
        '| Solar spectrum | Sun emits less violet than blue (blackbody at 5778 K) |\n' +
        '| Ozone absorption | Hartley band absorbs UV and some violet (200–320 nm) |\n' +
        '| Eye sensitivity | S-cones peak at 420 nm, but L+M cones (red+green) dominate perception |\n' +
        '| Combined | Perceived sky peaks at **470–480 nm** — azure blue |\n\n' +
        '**Atmospheric optical depth** for Rayleigh scattering at sea level: τ ≈ 0.008735 × λ⁻⁴·⁰⁸ (λ in μm). At 470 nm: τ ≈ 0.008735 × 0.47⁻⁴·⁰⁸ ≈ 0.19. At the zenith, transmission = e⁻⁰·¹⁹ ≈ 83% — most blue light reaches you directly, but enough scatters sideways to make the whole sky blue.',
      advancedContent:
        '**Rayleigh scattering is the small-particle limit of Mie theory.**\n\n' +
        'Gustav Mie (1908) solved Maxwell\'s equations exactly for a plane wave hitting a dielectric sphere of arbitrary size. The key parameter is the **size parameter**:\n\n' +
        '> **x = 2πr/λ**\n\n' +
        '| Regime | Size parameter | Physics | Example |\n' +
        '|--------|---------------|---------|--------|\n' +
        '| Rayleigh | x << 1 | I ∝ 1/λ⁴, symmetric scattering | N₂, O₂ molecules (r ~ 0.1 nm) |\n' +
        '| Mie | x ≈ 1 | Complex angular lobes | Fog droplets (r ~ 1 μm) |\n' +
        '| Geometric | x >> 1 | Ray optics, refraction | Raindrops (r ~ 1 mm) |\n\n' +
        'The Rayleigh scattering cross-section:\n\n' +
        '`σ = (8π/3)(2πr/λ)⁴ × r² × |(m²−1)/(m²+2)|²`\n\n' +
        'where m = n₁/n₂ is the relative complex refractive index. The (m²−1)/(m²+2) factor is the **Clausius-Mossotti relation** connecting bulk refractive index to molecular polarizability α.\n\n' +
        '**Applications beyond blue skies:**\n\n' +
        '| Phenomenon | Mechanism |\n' +
        '|-----------|----------|\n' +
        '| Interstellar reddening | Dust grains scatter blue starlight → distant stars appear redder |\n' +
        '| Cigarette smoke (side-lit) | Tiny particles (< 100 nm) scatter blue preferentially |\n' +
        '| Tyndall effect in dilute milk | Casein micelles (~200 nm) scatter blue → milk has bluish tinge |\n' +
        '| Structural blue in butterflies | Nanostructures (x ≈ 1) produce vivid blue without pigment |\n\n' +
        '**Polarization:** Rayleigh-scattered light is partially **linearly polarised**, with maximum polarisation at 90° from the Sun. Polarising sunglasses exploit this to cut glare. Bees navigate using the sky\'s polarisation pattern — they can find the Sun\'s direction even through thick cloud.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Blue light scatters about 6 times more than red light in the atmosphere.', answer: true, explanation: 'From the 1/λ⁴ law: (700/450)⁴ = 5.86 ≈ 6×. Blue\'s shorter wavelength makes it scatter far more.' },
            { text: 'The sky would appear violet if our eyes were equally sensitive to all wavelengths.', answer: true, explanation: 'Violet scatters 11.5× more than red. Our eyes\' low violet sensitivity and ozone absorption are the only reasons the sky looks blue instead of violet.' },
            { text: 'Rayleigh scattering only happens in Earth\'s atmosphere.', answer: false, explanation: 'Rayleigh scattering happens whenever light hits particles much smaller than its wavelength — in any atmosphere, in liquids (Tyndall effect), and even in interstellar space.' },
            { text: 'The sky at high altitude (like Shillong) appears a deeper blue than at sea level.', answer: true, explanation: 'Less atmosphere above means less multiple scattering, which would otherwise wash out the blue. The remaining scattered light is purer blue.' },
          ],
        },
      },
    },

    // ── Section 4: Sunsets ────────────────────────────────────
    {
      title: 'Why Sunsets Glow Orange and Red',
      diagram: 'BlueMountainScatteringDiagram',
      beginnerContent:
        'At sunset, sunlight travels through a **much thicker** slice of atmosphere compared to midday. During this longer journey, nearly all the blue and green light is scattered away before reaching your eyes. What remains is the longer-wavelength light — **reds, oranges, and deep yellows**.\n\n' +
        '| Sun position | Path through atmosphere | Colors that survive |\n' +
        '|-------------|----------------------|---------------------|\n' +
        '| Overhead (noon) | ~1× atmosphere thickness | All colors → white/yellow Sun |\n' +
        '| 30° above horizon | ~2× thickness | Some blue lost → warm yellow |\n' +
        '| At horizon (sunset) | ~38× thickness | Almost all blue gone → orange-red |\n\n' +
        '**Analogy:** Imagine shining a white torch through a series of blue filters. After one filter, the light is slightly yellow. After five filters, it is orange. After ten, deep red. Each layer of atmosphere acts like a blue filter — it removes blue and passes red.\n\n' +
        '**Why Assam has spectacular sunsets:**\n\n' +
        'The Brahmaputra valley traps a layer of humid air and fine particles — river mist, rice paddy moisture, and seasonal haze. These extra particles scatter away even more short-wavelength light, leaving behind rich **golds and crimsons**. The wide, flat river surface acts as a mirror, doubling the visual spectacle.\n\n' +
        '**Prediction:** After a volcanic eruption that fills the atmosphere with fine dust, would sunsets be *more* or *less* colorful? *(More! Extra particles scatter even more blue away, making reds deeper and adding purple hues.)*',
      intermediateContent:
        '**The airmass formula** tells you how much atmosphere sunlight must cross:\n\n' +
        'At zenith angle θ: **Air mass = 1/cos θ** (for θ < 75°)\n\n' +
        '| Sun position | Zenith angle θ | Air mass | Blue transmission |\n' +
        '|-------------|---------------|----------|-------------------|\n' +
        '| Overhead | 0° | 1.0 | 78% |\n' +
        '| 45° elevation | 45° | 1.41 | 71% |\n' +
        '| 10° elevation | 80° | 5.76 | 26% |\n' +
        '| Horizon | ~90° | **~38** | **0.013%** |\n\n' +
        '**Worked example — Beer-Lambert law at sunset:**\n\n' +
        'The **Beer-Lambert law**: **I = I₀ × e^(−τ × X)**, where τ is optical depth and X is air mass.\n\n' +
        'For blue light (450 nm) at sea level: τ_blue ≈ 0.235.\n\n' +
        '`I/I₀ = e^(−0.235 × 38) = e^(−8.93) ≈ 0.00013`\n\n' +
        'Only **0.013%** of blue light survives the sunset path — essentially zero.\n\n' +
        'For red light (700 nm): τ_red ≈ 0.033.\n\n' +
        '`I/I₀ = e^(−0.033 × 38) = e^(−1.25) ≈ 0.287`\n\n' +
        '**28.7%** of red light survives. Hence the sky glows red.\n\n' +
        '| Wavelength | τ (sea level) | Transmission at sunset (X=38) |\n' +
        '|-----------|--------------|-------------------------------|\n' +
        '| 400 nm (violet) | 0.370 | e⁻¹⁴·¹ ≈ 0.000001 (0.0001%) |\n' +
        '| 450 nm (blue) | 0.235 | e⁻⁸·⁹ ≈ 0.013% |\n' +
        '| 550 nm (green) | 0.093 | e⁻³·⁵ ≈ 3.0% |\n' +
        '| 650 nm (orange) | 0.044 | e⁻¹·⁷ ≈ 18.3% |\n' +
        '| 700 nm (red) | 0.033 | e⁻¹·³ ≈ 28.7% |',
      advancedContent:
        '**Volcanic sunsets — when the sky turns purple:**\n\n' +
        'Major eruptions inject **sulfate aerosols** (0.1–1 μm diameter) into the stratosphere, where they persist for 1–3 years.\n\n' +
        '| Eruption | Year | SO₂ injected (Mt) | Global cooling | Sunset effect |\n' +
        '|----------|------|-------------------|----------------|---------------|\n' +
        '| Tambora | 1815 | ~60 | −0.7°C ("Year Without Summer") | Blood-red sunsets worldwide |\n' +
        '| Krakatoa | 1883 | ~20 | −0.3°C | "Chelsea sunsets" inspired painters |\n' +
        '| Pinatubo | 1991 | ~17 | −0.5°C for 2 years | Vivid red-purple for 2 years |\n\n' +
        'The **purple twilight** ("Belt of Venus") occurs because red sunset light illuminates high-altitude atmosphere that also scatters blue — red + blue = purple.\n\n' +
        '**Sun photometry** (NASA\'s AERONET network) measures the solar spectrum at different zenith angles, fitting data to Mie + Rayleigh models to retrieve aerosol size distributions in real time. This is how scientists track wildfire smoke transport across continents.\n\n' +
        '**The green flash:**\n\n' +
        'At the exact moment of sunset, atmospheric refraction can separate the solar disc\'s colors vertically. Green light refracts more than red (higher n), so the green image of the Sun sits slightly above the red image. As the red disc disappears, a brief **green flash** is visible for 1–2 seconds. Conditions: a clear, distant horizon (ocean) and stable atmosphere. The effect is enhanced by an **atmospheric duct** (temperature inversion) that acts as a waveguide.\n\n' +
        '**Observing the green flash:** The green flash has been photographed from Digha and Goa but is extremely rare from the Brahmaputra valley due to atmospheric turbulence and haze. The best chance in NE India would be from Cherrapunji on a clear winter evening looking west.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'After the 1883 Krakatoa eruption, sunsets were so vividly red that fire brigades were called out in New York — people thought buildings were on fire.',
            'The Brahmaputra valley\'s humid air makes Assamese sunsets among the most colorful in India — moisture particles scatter extra blue light away.',
            'Mars has blue sunsets! Its atmosphere is thin but full of fine dust that scatters red light forward, leaving blue light concentrated around the setting Sun.',
            'The "green flash" at sunset is real — it lasts 1–2 seconds and occurs because the atmosphere refracts green light more than red.',
          ],
        },
      },
    },

    // ── Section 5: Refraction & Snell's Law ───────────────────
    {
      title: 'Refraction — How Light Bends',
      diagram: 'LensRayDiagram',
      beginnerContent:
        'When light passes from one material to another — say from air into water, or from air into glass — it **changes speed**. This change in speed causes the light to **bend**, a phenomenon called **refraction**.\n\n' +
        '**Analogy:** Imagine a line of marching soldiers crossing from pavement onto sand at an angle. The soldiers who reach the sand first slow down, while those still on pavement keep their speed. The line pivots — exactly like a light ray bending at an interface.\n\n' +
        '| Medium | Speed of light | How much it slows |\n' +
        '|--------|---------------|-------------------|\n' +
        '| Vacuum | 300,000 km/s | 0% (reference) |\n' +
        '| Air | 299,700 km/s | 0.03% slower |\n' +
        '| Water | 225,000 km/s | 25% slower |\n' +
        '| Glass | 200,000 km/s | 33% slower |\n' +
        '| Diamond | 124,000 km/s | 59% slower |\n\n' +
        '**Everyday refraction:**\n\n' +
        '| What you notice | What\'s really happening |\n' +
        '|----------------|------------------------|\n' +
        '| A straw looks "broken" in water | Light bends as it exits water → brain draws the wrong straight line |\n' +
        '| A pool looks shallower than it is | Refraction bends light upward → objects appear higher |\n' +
        '| Stars twinkle | Pockets of warm/cool air refract starlight in random directions |\n' +
        '| A prism makes a rainbow | Each color bends by a different amount (dispersion) |\n\n' +
        '**Spearfishing and Snell\'s Law:** Fisher folk along the Brahmaputra know that a fish is never where it appears to be. They aim their spear *below* the visible image — instinctively correcting for refraction. This traditional knowledge encodes Snell\'s Law without a single equation.\n\n' +
        '**Try the diagram above** — adjust the angle and medium to see how much light bends.',
      intermediateContent:
        '**Snell\'s Law** governs refraction:\n\n' +
        '> **n₁ sin θ₁ = n₂ sin θ₂**\n\n' +
        'where **n** is the refractive index (ratio of light speed in vacuum to speed in the medium).\n\n' +
        '| Medium | Refractive index (n) |\n' +
        '|--------|---------------------|\n' +
        '| Vacuum | 1.000 (exact) |\n' +
        '| Air | 1.0003 |\n' +
        '| Water | 1.333 |\n' +
        '| Crown glass | 1.52 |\n' +
        '| Flint glass | 1.66 |\n' +
        '| Diamond | 2.42 |\n\n' +
        '**Worked example 1 — light entering water:**\n\n' +
        'Light hits water at 45° from normal. Find the refracted angle.\n\n' +
        '`n₁ sin θ₁ = n₂ sin θ₂`\n' +
        '`1.00 × sin 45° = 1.333 × sin θ₂`\n' +
        '`0.707 = 1.333 × sin θ₂`\n' +
        '`sin θ₂ = 0.531`\n' +
        '`θ₂ = 32.1°`\n\n' +
        'The light bends **toward** the normal (from 45° to 32.1°) — it always does when entering a denser medium.\n\n' +
        '**Worked example 2 — apparent depth of a river:**\n\n' +
        'A stone sits 2 metres deep in the Brahmaputra. How deep does it *appear* from directly above?\n\n' +
        '`Apparent depth = Real depth / n_water = 2.0 / 1.333 = 1.50 m`\n\n' +
        'The stone appears **50 cm closer** to the surface than it really is.\n\n' +
        '**Dispersion** — the refractive index depends on wavelength:\n\n' +
        '| Glass type | n (red, 700 nm) | n (violet, 400 nm) | Difference |\n' +
        '|-----------|----------------|-------------------|------------|\n' +
        '| Crown glass | 1.514 | 1.532 | 0.018 |\n' +
        '| Flint glass | 1.645 | 1.680 | 0.035 |\n' +
        '| Diamond | 2.407 | 2.451 | 0.044 |\n\n' +
        'This small difference causes a prism to spread white light into a spectrum — violet bends more, red bends less.',
      advancedContent:
        '**Snell\'s Law from Fermat\'s principle:**\n\n' +
        'Light takes the path of **least time** between two points (Fermat, 1662). Since v = c/n, light moves slower in denser media. Minimising the travel time function T(x) using calculus yields:\n\n' +
        '`dT/dx = 0 → (sin θ₁)/v₁ = (sin θ₂)/v₂ → n₁ sin θ₁ = n₂ sin θ₂`\n\n' +
        '**The refractive index is electromagnetic:**\n\n' +
        '`n = c/v = √(εᵣ μᵣ)`\n\n' +
        'This links optics directly to Maxwell\'s equations. The Cauchy equation approximates dispersion:\n\n' +
        '`n(λ) = A + B/λ² + C/λ⁴`\n\n' +
        'For BK7 crown glass: A = 1.5046, B = 4.20 × 10⁻³ μm², C = 0.\n\n' +
        '| Advanced topic | Key idea |\n' +
        '|---------------|----------|\n' +
        '| **Metamaterials** (n < 0) | Engineered structures bend light "the wrong way" → superlenses beating λ/2 limit |\n' +
        '| **GRIN optics** | Continuously varying n(r) curves light without surfaces → atmospheric mirages |\n' +
        '| **Anomalous dispersion** | Near absorption lines, n *decreases* with frequency → superluminal group velocity (no information faster than c) |\n' +
        '| **Birefringence** | Crystals like calcite have different n for different polarisations → double images |\n\n' +
        '**Worked example — minimum deviation through a prism:**\n\n' +
        'For an equilateral prism (A = 60°), the minimum deviation δ_min relates to refractive index:\n\n' +
        '`n = sin((A + δ_min)/2) / sin(A/2)`\n\n' +
        'For crown glass (n = 1.52): `sin((60 + δ)/2) = 1.52 × sin 30° = 0.76`, so `(60+δ)/2 = 49.5°`, giving **δ_min = 39°**. This is how Newton measured refractive indices in the 1660s.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each refraction concept to its description',
          pairs: [
            ['Refractive index (n)', 'Ratio of light speed in vacuum to speed in medium — higher n = more bending'],
            ['Snell\'s Law', 'n₁ sin θ₁ = n₂ sin θ₂ — predicts exactly how much light bends at an interface'],
            ['Dispersion', 'Refractive index varies with wavelength — violet bends more than red → prisms make rainbows'],
            ['Apparent depth', 'Objects underwater look closer to the surface because refraction bends light upward'],
          ],
        },
      },
    },

    // ── Section 6: Total Internal Reflection ──────────────────
    {
      title: 'Total Internal Reflection & Fiber Optics',
      diagram: 'TotalInternalReflectionDiagram',
      beginnerContent:
        'Something remarkable happens when light tries to pass from a **denser** medium (like glass or water) into a **less dense** medium (like air): at steep enough angles, the light **cannot escape**. Instead of refracting through the surface, it bounces back entirely — **total internal reflection** (TIR).\n\n' +
        '**Analogy:** Imagine skipping a stone across water. At a shallow angle, the stone bounces off the surface. At a steep angle, it plunges in. Light does the opposite — at steep angles to the surface (large angles of incidence), it "skips" off the boundary.\n\n' +
        'The angle at which this starts happening is called the **critical angle**:\n\n' +
        '| Interface | Critical angle | What it means |\n' +
        '|-----------|---------------|---------------|\n' +
        '| Glass → Air | 41.8° | Light hitting glass surface at > 41.8° reflects totally |\n' +
        '| Water → Air | 48.8° | Light hitting water surface at > 48.8° reflects totally |\n' +
        '| Diamond → Air | 24.4° | Light trapped easily → diamonds sparkle brilliantly |\n\n' +
        '**Why diamonds sparkle:** Diamond has such a small critical angle (24.4°) that light entering the gem bounces around inside many times before escaping through a carefully cut facet. Each bounce separates the colors slightly (dispersion), creating rainbow "fire."\n\n' +
        '**Fiber optics — TIR in action:**\n\n' +
        'An optical fibre is a thin glass strand where light enters one end and bounces down the entire length by TIR — never escaping through the walls. This is how the internet works: your video calls, messages, and web pages travel as light pulses through thousands of kilometres of glass fibre.\n\n' +
        '**Fibre optics in practice:** The BharatNet project is laying optical fibre to connect gram panchayats across Assam and the NE states to high-speed internet. Each fibre is thinner than a human hair but can carry billions of bits per second — all thanks to total internal reflection.',
      intermediateContent:
        '**Calculating the critical angle:**\n\n' +
        'At the critical angle, the refracted ray grazes the surface (θ₂ = 90°).\n\n' +
        '`n₁ sin θ_c = n₂ sin 90° = n₂`\n' +
        '`θ_c = arcsin(n₂/n₁)`\n\n' +
        '**Worked example — glass to air:**\n\n' +
        '`θ_c = arcsin(1.00/1.50) = arcsin(0.667) = 41.8°`\n\n' +
        'Any ray hitting the glass-air boundary at > 41.8° is totally reflected.\n\n' +
        '| Interface | n₁ | n₂ | Critical angle | Application |\n' +
        '|-----------|-----|-----|---------------|-------------|\n' +
        '| Crown glass → Air | 1.52 | 1.00 | 41.1° | Prisms in binoculars |\n' +
        '| Water → Air | 1.33 | 1.00 | 48.8° | Underwater lighting effects |\n' +
        '| Diamond → Air | 2.42 | 1.00 | 24.4° | Gem cutting for maximum sparkle |\n' +
        '| Optical fibre core → cladding | 1.48 | 1.46 | 80.6° | Telecom fibre |\n\n' +
        '**How optical fibres carry data:**\n\n' +
        '| Component | Material | Refractive index | Role |\n' +
        '|-----------|---------|-----------------|------|\n' +
        '| Core | Pure silica glass | 1.48 | Light travels here |\n' +
        '| Cladding | Doped silica | 1.46 | Keeps light trapped (TIR) |\n' +
        '| Buffer | Polymer | — | Mechanical protection |\n\n' +
        '**Worked example — data capacity:**\n\n' +
        'A single-mode fibre at 1550 nm wavelength with 100 GHz channel spacing can carry ~80 channels (Dense Wavelength Division Multiplexing). Each channel at 100 Gbps → **8 Tbps per fibre**. A typical undersea cable bundles ~200 fibre pairs → **1.6 Petabits/s**. That is enough for 200 million simultaneous HD video streams.',
      advancedContent:
        '**Evanescent waves — light that leaks but doesn\'t escape:**\n\n' +
        'During TIR, Maxwell\'s equations show that the electromagnetic field doesn\'t stop abruptly at the interface. An **evanescent wave** extends into the less dense medium, decaying exponentially:\n\n' +
        '`E(z) = E₀ × e^(−z/δ)`\n\n' +
        'where the penetration depth is:\n\n' +
        '`δ = λ / (2π √(n₁² sin²θ − n₂²))`\n\n' +
        '**Worked example:** Glass (n=1.52) to air, θ = 45°, λ = 500 nm.\n\n' +
        '`δ = 500 / (2π √(1.52² × sin²45° − 1²))`\n' +
        '`= 500 / (2π √(1.155 − 1))`\n' +
        '`= 500 / (2π × 0.394) = **202 nm**`\n\n' +
        'The field penetrates ~200 nm — about half a wavelength.\n\n' +
        '| Application | How it uses evanescent waves |\n' +
        '|------------|-----------------------------|\n' +
        '| **TIRF microscopy** | Illuminates only ~100 nm above surface → single-molecule imaging |\n' +
        '| **Frustrated TIR** | Bringing a second prism within δ allows light to "tunnel" across the gap |\n' +
        '| **Fiber sensors** | Evanescent field probes chemical environment around the fibre |\n' +
        '| **ATR spectroscopy** | IR evanescent wave absorbed by sample touching crystal surface |\n\n' +
        '**Fiber optic attenuation:**\n\n' +
        '| Wavelength window | Loss (dB/km) | Cause of minimum |\n' +
        '|------------------|-------------|-------------------|\n' +
        '| 850 nm | 2.5 | Multimode, short links |\n' +
        '| 1310 nm | 0.35 | Zero dispersion window |\n' +
        '| **1550 nm** | **0.20** | **Absolute minimum** — Rayleigh scattering ∝ 1/λ⁴ |\n' +
        '| 1625 nm | 0.25 | Increasing OH absorption |\n\n' +
        'The 0.20 dB/km at 1550 nm means light loses half its power every 15 km. Erbium-doped fibre amplifiers (EDFAs) boost the signal every 60–100 km without converting to electrical — enabling transoceanic cables.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Total internal reflection can happen when light goes from air into glass.', answer: false, explanation: 'TIR only occurs when light goes from a denser medium (higher n) to a less dense one (lower n) — e.g., glass to air, not air to glass.' },
            { text: 'Diamond sparkles more than glass because diamond has a smaller critical angle.', answer: true, explanation: 'Diamond\'s critical angle is only 24.4° (vs 41.8° for glass). Light bounces inside many more times before escaping, creating intense sparkle.' },
            { text: 'Optical fibres use mirrors to reflect light along the cable.', answer: false, explanation: 'Fibres use total internal reflection — the glass-cladding interface acts as a perfect mirror at steep angles. No physical mirror needed.' },
            { text: 'During total internal reflection, no light energy enters the second medium at all.', answer: false, explanation: 'An evanescent wave penetrates ~100-200 nm into the second medium but decays exponentially. It carries no net energy away unless another surface is brought close (frustrated TIR).' },
          ],
        },
      },
    },

    // ── Section 7: Types of Scattering ────────────────────────
    {
      title: 'Types of Scattering — Rayleigh, Mie & Raman',
      diagram: 'MilkScatteringDiagram',
      beginnerContent:
        'Rayleigh scattering is not the only way light interacts with particles. The type of scattering depends on **particle size relative to the wavelength**.\n\n' +
        '| Scattering type | Particle size vs wavelength | Key effect | Example |\n' +
        '|----------------|---------------------------|-----------|--------|\n' +
        '| **Rayleigh** | Much smaller (molecules) | Blue scattered most (1/λ⁴) | Blue sky |\n' +
        '| **Mie** | Similar size (droplets, dust) | All colors scattered equally | White clouds |\n' +
        '| **Geometric** | Much larger (raindrops) | Refraction + reflection | Rainbows |\n' +
        '| **Raman** | Any size (rare event) | Light *changes wavelength* | Chemical fingerprinting |\n\n' +
        '**Why clouds are white:** Cloud droplets (~10 μm) are much larger than visible light wavelengths (~0.5 μm). Mie scattering affects all colors equally — red, green, blue all scatter the same amount. Equal mix of all colors = **white**.\n\n' +
        '**Why storm clouds are dark:** Very thick clouds scatter light so many times that much of it bounces back out the top. Less light reaches the bottom → the base looks grey or black. It is not a different *type* of scattering — just *more* of it.\n\n' +
        '**Quick check:** A glass of water looks clear, but add a few drops of milk and shine a torch through it — the beam appears bluish from the side and reddish looking through. Why?\n\n' +
        '*The tiny fat globules in milk (< 1 μm) are just the right size for Rayleigh-like scattering. Blue light scatters sideways; red passes straight through — a miniature sky-and-sunset in a glass!*\n\n' +
        '**Fog and scattering:** Morning fog in the Brahmaputra floodplains appears white because the water droplets are Mie-sized. As the Sun rises and droplets partially evaporate, they shrink toward Rayleigh-size — and the fog takes on a faintly bluish tinge before vanishing.',
      intermediateContent:
        '**The size parameter** determines which scattering regime applies:\n\n' +
        '> **x = 2πr/λ**\n\n' +
        '| Regime | Size parameter x | Particle radius r (for λ=500 nm) | Physics |\n' +
        '|--------|-----------------|--------------------------------|--------|\n' +
        '| Rayleigh | x << 1 | < ~40 nm | I ∝ 1/λ⁴, symmetric |\n' +
        '| Mie transition | x ≈ 1–10 | 80 nm – 0.8 μm | Complex angular lobes |\n' +
        '| Mie (large x) | x >> 10 | > 1 μm | Nearly wavelength-independent |\n' +
        '| Geometric | x >> 100 | > 10 μm | Ray optics — refraction, reflection |\n\n' +
        '**Worked example — cloud droplet:**\n\n' +
        'Radius r = 10 μm, λ = 500 nm:\n\n' +
        '`x = 2π × 10,000 nm / 500 nm = 126`\n\n' +
        'Deep in the Mie regime → scatters all visible wavelengths nearly equally → **white cloud**.\n\n' +
        '**Raman scattering** (discovered by C.V. Raman, 1928, Nobel Prize 1930):\n\n' +
        'In Raman scattering, the photon exchanges energy with a molecular vibration. The **Raman shift** Δν is characteristic of each chemical bond:\n\n' +
        '| Bond | Raman shift (cm⁻¹) | Found in |\n' +
        '|------|-------------------|----------|\n' +
        '| O-H stretch | ~3,400 | Water |\n' +
        '| C-H stretch | ~2,900 | Organic molecules |\n' +
        '| C=O stretch | ~1,700 | Proteins, fats |\n' +
        '| C=C stretch | ~1,600 | Aromatics |\n' +
        '| S-S stretch | ~500 | Disulfide bonds in hair, silk |\n\n' +
        'Only about **1 in 10 million** photons undergoes Raman scattering — the rest scatter elastically (Rayleigh). Yet this tiny signal is a powerful chemical fingerprint.',
      advancedContent:
        '**Mie theory — exact solution to Maxwell\'s equations:**\n\n' +
        'Mie\'s 1908 solution expands the incident and scattered fields in vector spherical harmonics. The scattering efficiency Q_sca and extinction efficiency Q_ext are computed from Mie coefficients aₙ and bₙ, which depend on the size parameter x and complex refractive index m:\n\n' +
        '`Q_ext = (2/x²) Σ (2n+1) Re(aₙ + bₙ)`\n\n' +
        '| Feature | Rayleigh limit | Full Mie |\n' +
        '|---------|---------------|----------|\n' +
        '| Q_sca | ∝ x⁴ | Oscillates, approaches ~2 (extinction paradox) |\n' +
        '| Angular distribution | Symmetric (1 + cos²θ) | Forward-peaked with complex lobes |\n' +
        '| Polarization | Fully polarised at 90° | Partially polarised, angle-dependent |\n\n' +
        '**Surface-Enhanced Raman Spectroscopy (SERS):**\n\n' +
        'SERS uses metallic nanostructures (Au, Ag) to amplify Raman signal by **10⁶–10¹⁰×**, enabling single-molecule detection.\n\n' +
        '| Enhancement mechanism | Contribution |\n' +
        '|----------------------|-------------|\n' +
        '| Electromagnetic (LSPR hot spots) | ~10⁴–10⁸× |\n' +
        '| Chemical (charge transfer) | ~10–100× |\n' +
        '| **Combined** | **Up to 10¹⁰×** |\n\n' +
        'The electromagnetic enhancement comes from **localized surface plasmon resonance** — the incident light excites collective electron oscillations in the nanoparticle, creating intense fields in "hot spots" between particles.\n\n' +
        'SERS applications: forensic analysis of trace evidence, detecting cancer biomarkers in blood, authenticating historical artworks, and identifying counterfeit medicines — all from a single laser spot.\n\n' +
        '**Brillouin scattering** — light scattering from acoustic phonons (sound waves in a material). The frequency shift is proportional to the sound velocity: Δf = 2nv_s sin(θ/2)/λ. This allows non-contact measurement of elastic moduli at the microscale.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match the scattering type to its key property',
          pairs: [
            ['Rayleigh scattering', 'Particles much smaller than λ — scatters blue 6× more than red (1/λ⁴)'],
            ['Mie scattering', 'Particles similar to λ — scatters all colors equally → white clouds'],
            ['Raman scattering', 'Light changes wavelength — chemical fingerprint (only 1 in 10⁷ photons)'],
            ['SERS', 'Metal nanoparticles amplify Raman signal by 10⁶–10¹⁰× → single-molecule detection'],
          ],
        },
      },
    },

    // ── Section 8: Color Mixing ──────────────────────────────
    {
      title: 'Color Mixing — Additive vs Subtractive',
      beginnerContent:
        'There are two fundamentally different ways to mix colors, and confusing them is one of the most common mistakes in science and art.\n\n' +
        '**Additive mixing (light):** Combines light beams. More light = brighter.\n\n' +
        '**Subtractive mixing (pigment):** Combines filters/pigments that absorb light. More pigment = darker.\n\n' +
        '| | Additive (light) | Subtractive (pigment) |\n' +
        '|---|----------------|----------------------|\n' +
        '| **Primaries** | Red, Green, Blue (RGB) | Cyan, Magenta, Yellow (CMY) |\n' +
        '| **All primaries combined** | **White** | **Black** |\n' +
        '| **Used in** | Screens, projectors, stage lights | Paints, inks, printers |\n' +
        '| **More mixing →** | Brighter | Darker |\n\n' +
        '**Why the difference?** A screen *emits* light — adding red and green photons together stimulates both L and M cones, and your brain perceives yellow. Paint *absorbs* light — mixing red and green paint absorbs both blue AND most other wavelengths, leaving muddy brown.\n\n' +
        '| Light mix | Result | Pigment mix | Result |\n' +
        '|-----------|--------|-------------|--------|\n' +
        '| Red + Green | Yellow | Red + Green | Brown |\n' +
        '| Red + Blue | Magenta | Red + Blue | Dark purple |\n' +
        '| Green + Blue | Cyan | Yellow + Blue | Green |\n' +
        '| Red + Green + Blue | **White** | Cyan + Magenta + Yellow | **Black** |\n\n' +
        '**Check yourself:** When you see a red flower, is the flower *emitting* red light or *reflecting* it? *(Reflecting! The pigments absorb every wavelength except red, which bounces back to your eyes.)*\n\n' +
        '**Natural dyes and subtractive color:** Traditional Assamese weavers create colors for *mekhela chador* using natural dyes — turmeric for yellow, indigo for blue, lac for red. These are subtractive mixtures: the dye molecules absorb specific wavelengths from white light, and only the unabsorbed color reaches your eyes.',
      intermediateContent:
        '**RGB color model — how screens work:**\n\n' +
        'Each pixel on a screen has three tiny sub-pixels (Red, Green, Blue), each controlled from 0–255 intensity levels. The total displayable colors:\n\n' +
        '`256 × 256 × 256 = 16,777,216 colors`\n\n' +
        '| RGB value | Red | Green | Blue | Resulting color |\n' +
        '|-----------|-----|-------|------|----------------|\n' +
        '| (255, 0, 0) | Full | Off | Off | Pure red |\n' +
        '| (0, 255, 0) | Off | Full | Off | Pure green |\n' +
        '| (255, 255, 0) | Full | Full | Off | Yellow |\n' +
        '| (0, 255, 255) | Off | Full | Full | Cyan |\n' +
        '| (255, 0, 255) | Full | Off | Full | Magenta |\n' +
        '| (128, 128, 128) | Half | Half | Half | Grey |\n' +
        '| (255, 165, 0) | Full | Mid | Off | Orange |\n\n' +
        '**CMY(K) color model — how printers work:**\n\n' +
        'Each pigment absorbs one primary light color:\n\n' +
        '| Pigment | Absorbs | Reflects | Relationship |\n' +
        '|---------|---------|----------|-------------|\n' +
        '| Cyan | Red | Green + Blue | Cyan = White − Red |\n' +
        '| Magenta | Green | Red + Blue | Magenta = White − Green |\n' +
        '| Yellow | Blue | Red + Green | Yellow = White − Blue |\n' +
        '| **C + M + Y** | **All** | **Nothing** | **= Black (in theory)** |\n\n' +
        'In practice, mixing C+M+Y gives muddy dark brown (pigments aren\'t perfect absorbers), so printers add a **K (black)** cartridge — hence CMYK.\n\n' +
        '**Worked example — why mixing yellow and cyan paint makes green:**\n\n' +
        'Yellow pigment absorbs blue, reflects red + green.\n' +
        'Cyan pigment absorbs red, reflects green + blue.\n' +
        'Together, red is absorbed (by cyan) AND blue is absorbed (by yellow). Only **green** survives both filters.',
      advancedContent:
        '**CIE color spaces — the mathematics of color perception:**\n\n' +
        'The CIE 1931 XYZ system defines three "virtual primaries" that encompass *all* perceivable colors — no real display can match the full CIE gamut.\n\n' +
        '| Color space | Year | Gamut coverage | Purpose |\n' +
        '|-------------|------|---------------|--------|\n' +
        '| CIE 1931 XYZ | 1931 | 100% (by definition) | Master reference space |\n' +
        '| CIE Lab | 1976 | 100% | Perceptually uniform — ΔE ≈ 1 is just-noticeable |\n' +
        '| sRGB | 1996 | ~35% | Web, standard monitors |\n' +
        '| Adobe RGB | 1998 | ~50% | Photography |\n' +
        '| DCI-P3 | 2005 | ~45% | Cinema, Apple displays |\n' +
        '| Rec. 2020 | 2012 | ~76% | HDR television |\n\n' +
        'Chromaticity coordinates: `x = X/(X+Y+Z)`, `y = Y/(X+Y+Z)`. The gamut of any RGB display is the triangle formed by its three primaries in (x,y) space.\n\n' +
        '**Color difference (ΔE):**\n\n' +
        '| ΔE value | Perception |\n' +
        '|----------|------------|\n' +
        '| < 1 | Imperceptible |\n' +
        '| 1–2 | Just noticeable by trained eye |\n' +
        '| 2–10 | Noticeable at a glance |\n' +
        '| > 10 | Different color entirely |\n\n' +
        '**Spectral rendering** in computer graphics simulates light transport at individual wavelengths (not just RGB triplets), correctly handling dispersion, fluorescence, and metamerism. This is essential for physically accurate rendering of prisms, oil films, and morpho butterfly wings.\n\n' +
        '**ICC profiles** map device RGB/CMYK values to device-independent CIE Lab coordinates using multidimensional lookup tables with thousands of calibration patches — ensuring a photo looks the same on your screen, your printer, and a billboard.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each color system to its properties',
          pairs: [
            ['Additive (RGB)', 'Red + Green + Blue = White — used in screens, projectors'],
            ['Subtractive (CMY)', 'Cyan + Magenta + Yellow = Black — used in paints, printers'],
            ['sRGB color space', '~35% of perceivable colors — standard for web and monitors'],
            ['CIE Lab', 'Perceptually uniform — ΔE = 1 is the just-noticeable difference'],
          ],
        },
      },
    },
  ]
};
