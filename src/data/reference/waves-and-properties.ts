import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'waves-and-properties',
  title: 'Waves & Wave Properties',
  category: 'physics',
  icon: '🌊',
  tagline: 'From ocean waves to WiFi signals — the universal language of oscillation.',
  relatedStories: ['fishermans-daughter-storm', 'river-dolphins-secret', 'mountain-echoes'],
  understand: [
    // ── Section 1: Transverse vs Longitudinal ─────────────────
    {
      title: 'Transverse vs Longitudinal Waves',
      diagram: 'TransverseLongitudinalDiagram',
      beginnerContent:
        'All waves carry **energy** from one place to another — but the medium itself doesn\'t travel. A wave on the Brahmaputra doesn\'t carry water downstream; it passes *through* the water. The key question is: **how do the particles move relative to the wave\'s direction?**\n\n' +
        '| Wave type | Particle motion | Wave direction | Analogy |\n' +
        '|-----------|----------------|----------------|----------|\n' +
        '| **Transverse** | Perpendicular (up-down) | Horizontal | Shaking a rope side-to-side |\n' +
        '| **Longitudinal** | Parallel (back-forth) | Same as particle | Pushing a Slinky from one end |\n\n' +
        '**Transverse waves** — the particles oscillate at right angles to the wave\'s travel. Imagine tying a rope to a post and flicking your wrist up and down. A wave pulse travels *along* the rope, but each point on the rope moves only *up and down*. Light, radio waves, and all electromagnetic radiation are transverse.\n\n' +
        '**Longitudinal waves** — the particles oscillate along the same line the wave travels. Sound is the classic example. When a dhol drum skin pushes forward, it compresses the air in front of it. That compression travels outward as a wave. The regions of high pressure are called **compressions**, and the stretched-apart regions are **rarefactions**.\n\n' +
        '| Example | Type | Why |\n' +
        '|---------|------|-----|\n' +
        '| Light from a *saaki* (oil lamp) | Transverse | E and B fields oscillate perpendicular to light\'s travel |\n' +
        '| Sound of a *pepa* (horn) at Bihu | Longitudinal | Air molecules push back and forth along the sound direction |\n' +
        '| Water wave on the Brahmaputra | **Both** | Water molecules move in elliptical paths — partly up-down, partly back-forth |\n' +
        '| Earthquake P-wave | Longitudinal | Fastest seismic wave — arrives first at stations |\n' +
        '| Earthquake S-wave | Transverse | Slower, more destructive — side-to-side shaking |\n\n' +
        '**Check yourself:** You\'re standing on the bank of the Brahmaputra and a ferry passes. The wake reaches you, bobbing your fishing cork up and down. Is this transverse, longitudinal, or both?\n\n' +
        '*It\'s both — surface water waves combine up-down and back-forth motion in elliptical paths. The cork traces a small circle, not just a straight line.*',
      intermediateContent:
        '**Wave speed depends on the medium — and the wave type.**\n\n' +
        '| Medium / situation | Formula | Typical speed |\n' +
        '|--------------------|---------|---------------|\n' +
        '| String (guitar, sitar) | v = √(T/μ), T = tension, μ = mass/length | 100–400 m/s |\n' +
        '| Sound in air (20°C) | v ≈ 331 + 0.6T(°C) m/s | **343 m/s** |\n' +
        '| Sound in water | v = √(B/ρ), B = bulk modulus | **1,480 m/s** |\n' +
        '| Sound in steel | v = √(Y/ρ), Y = Young\'s modulus | **5,960 m/s** |\n' +
        '| Seismic P-wave (granite) | v_P = √[(K + 4G/3)/ρ] | ~6,000 m/s |\n' +
        '| Seismic S-wave (granite) | v_S = √(G/ρ) | ~3,500 m/s |\n\n' +
        '**Worked example — guitar string:**\n\n' +
        'A sitar wire has tension T = 80 N and linear mass density μ = 0.005 kg/m.\n\n' +
        'v = √(T/μ) = √(80/0.005) = √16,000 = **126.5 m/s**\n\n' +
        '**Worked example — sound speed at altitude:**\n\n' +
        'At the summit of Saramati Peak (Nagaland, 3,841 m) the temperature is about 5°C.\n\n' +
        'v = 331 + 0.6 × 5 = **334 m/s** — about 2.6% slower than at sea-level Guwahati (35°C → 352 m/s).\n\n' +
        '**Worked example — seismograph distance:**\n\n' +
        'P-waves travel at 6,000 m/s, S-waves at 3,500 m/s. A seismograph records P-waves 8 seconds before S-waves.\n\n' +
        'd = Δt / (1/v_S − 1/v_P) = 8 / (1/3500 − 1/6000) = 8 / (0.0002857 − 0.0001667) = 8 / 0.0001190 = **67.2 km**\n\n' +
        'The 2016 Manipur earthquake (6.7 magnitude) was located using exactly this P-S time delay method from seismograph stations across NE India.',
      advancedContent:
        '**Why S-waves cannot travel through liquids — and what that tells us about Earth\'s interior:**\n\n' +
        'Transverse waves require the medium to resist **shear** (sideways deformation). Liquids have zero shear modulus — they flow instead of springing back. This means S-waves *cannot* propagate through any liquid.\n\n' +
        '| Seismic observation | What it proves |\n' +
        '|---------------------|----------------|\n' +
        '| S-waves vanish in the "shadow zone" (104°–140° from epicentre) | Earth\'s outer core is **liquid** (Oldham, 1906) |\n' +
        '| P-waves refract and slow in outer core | Outer core is liquid iron-nickel alloy |\n' +
        '| PKJKP phases detected (faintly) | Inner core is **solid** — it supports shear |\n' +
        '| v_P/v_S ratio in crust | Helps identify rock types and fluid content |\n\n' +
        '**Polarisation — proof that light is transverse:**\n\n' +
        'If light were longitudinal, it could not be polarised. A polarising filter passes only the component of the E-field along one axis. Rotating a second polariser (analyser) from parallel to perpendicular drops the transmitted intensity from maximum to zero — **Malus\'s law: I = I₀ cos²θ**.\n\n' +
        '**Gravitational waves** (predicted by Einstein 1916, detected by LIGO 2015) are transverse: they stretch space in one direction while compressing it perpendicularly (the "+" and "×" polarisations). The simultaneous detection of gravitational waves and gamma rays from a neutron star merger (GW170817, 2017) confirmed gravitational waves travel at exactly *c*, to 15 significant figures.\n\n' +
        '**In superfluids** (liquid helium below 2.17 K), "second sound" is a longitudinal wave of *entropy* rather than pressure — a temperature oscillation travelling at ~20 m/s.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each wave to its type',
          pairs: [
            ['Sound from a pepa (horn)', 'Longitudinal — air molecules vibrate parallel to the wave direction'],
            ['Light from the Sun', 'Transverse — electric and magnetic fields oscillate perpendicular to travel'],
            ['Earthquake P-wave', 'Longitudinal — compresses and expands rock along the wave direction'],
            ['Earthquake S-wave', 'Transverse — shakes rock side-to-side, perpendicular to travel'],
            ['Ripple on the Brahmaputra', 'Both — water molecules trace elliptical paths combining vertical and horizontal motion'],
          ],
        },
      },
    },

    // ── Section 2: The Wave Equation ──────────────────────────
    {
      title: 'The Wave Equation: v = fλ',
      diagram: 'WaveEquationDiagram',
      beginnerContent:
        'Every wave — from the rumble of a dhol to the glow of a firefly — is described by three quantities locked together by one elegant equation:\n\n' +
        '> **v = fλ**\n\n' +
        '| Symbol | Name | Unit | Meaning |\n' +
        '|--------|------|------|---------|\n' +
        '| v | Wave speed | m/s | How fast the wave pattern moves through the medium |\n' +
        '| f | Frequency | Hz (cycles/second) | How many complete cycles pass a point per second |\n' +
        '| λ | Wavelength (lambda) | m | Distance from one crest to the next |\n\n' +
        'If you know any two, you can calculate the third.\n\n' +
        '**Worked example 1 — Middle C on a piano:**\n\n' +
        'Sound speed in air ≈ 343 m/s. Middle C = 262 Hz.\n\n' +
        'λ = v/f = 343/262 = **1.31 m** — each compression-rarefaction cycle of middle C stretches about 1.3 metres through the air.\n\n' +
        '**Worked example 2 — The highest and lowest piano notes:**\n\n' +
        '| Note | Frequency | Wavelength (λ = 343/f) | Comparison |\n' +
        '|------|-----------|------------------------|------------|\n' +
        '| Lowest (A₀) | 27.5 Hz | **12.5 m** | Longer than a classroom |\n' +
        '| Middle C | 262 Hz | **1.31 m** | About the width of a door |\n' +
        '| Highest (C₈) | 4,186 Hz | **0.082 m** | About the width of your fist |\n\n' +
        'Higher frequency → shorter wavelength. Lower frequency → longer wavelength. The speed stays the same (343 m/s in air).\n\n' +
        '**Worked example 3 — Red light:**\n\n' +
        'Light speed = 3 × 10⁸ m/s. Red light has λ = 700 nm = 700 × 10⁻⁹ m.\n\n' +
        'f = v/λ = 3 × 10⁸ / 700 × 10⁻⁹ = **4.3 × 10¹⁴ Hz** — 430 trillion cycles per second!\n\n' +
        '**Why FM antennas are about 1.5 m long:** FM radio at 100 MHz has λ = 3 × 10⁸ / 10⁸ = **3 m**. An efficient antenna is about half a wavelength, so ~1.5 m. The FM antenna on a Guwahati rooftop matches this perfectly.',
      intermediateContent:
        '**More worked examples across the spectrum:**\n\n' +
        '| Situation | Given | Find | Calculation | Answer |\n' +
        '|-----------|-------|------|-------------|--------|\n' +
        '| Ocean swell (Digha) | 10 crests in 25 s, λ = 8 m | v | f = 10/25 = 0.4 Hz; v = 0.4 × 8 | **3.2 m/s** |\n' +
        '| Microwave oven | f = 2.45 GHz | λ | 3×10⁸ / 2.45×10⁹ | **12.2 cm** |\n' +
        '| WiFi (5 GHz band) | f = 5 GHz | λ | 3×10⁸ / 5×10⁹ | **6 cm** |\n' +
        '| Earthquake P-wave | v = 6000 m/s, f = 5 Hz | λ | 6000 / 5 | **1,200 m** |\n' +
        '| Dolphin sonar (Brahmaputra) | f = 80 kHz, v = 1480 m/s | λ | 1480 / 80000 | **1.85 cm** |\n\n' +
        'The Gangetic river dolphin (*Platanista gangetica*) in the Brahmaputra uses echolocation clicks at 15–150 kHz. At 80 kHz in water, its sonar wavelength is just 1.85 cm — small enough to detect fish of a few centimetres.\n\n' +
        '**Related quantities:**\n\n' +
        '| Quantity | Symbol | Formula | Unit |\n' +
        '|----------|--------|---------|------|\n' +
        '| Period | T | T = 1/f | seconds |\n' +
        '| Angular frequency | ω | ω = 2πf | rad/s |\n' +
        '| Wave number | k | k = 2π/λ | rad/m |\n' +
        '| Alternative wave equation | | v = ω/k | m/s |\n\n' +
        '**Worked example — period of Middle C:**\n\n' +
        'T = 1/262 = **3.82 ms**. Your eardrum completes one full vibration cycle in under 4 milliseconds — 262 times every second.',
      advancedContent:
        '**The wave equation as a PDE:**\n\n' +
        'The full mathematical form is the second-order partial differential equation:\n\n' +
        '> **∂²y/∂t² = v² ∂²y/∂x²**\n\n' +
        'Its general solution (d\'Alembert, 1747) is **y(x,t) = f(x − vt) + g(x + vt)** — any shape propagating left and right at speed v. For sinusoidal waves: y = A sin(kx − ωt + φ), where the **phase velocity** is v_p = ω/k.\n\n' +
        '**Dispersion — when speed depends on wavelength:**\n\n' +
        '| Medium | Dispersion relation | Phase velocity | Group velocity |\n' +
        '|--------|--------------------|-----------------|-----------|\n' +
        '| Non-dispersive (sound in air) | ω = vk (linear) | v_p = v (constant) | v_g = v (same) |\n' +
        '| Deep water waves | ω = √(gk) | v_p = √(g/k) = √(gλ/2π) | v_g = v_p/2 |\n' +
        '| Quantum matter waves | ω = ℏk²/2m | v_p = ℏk/2m | v_g = ℏk/m = p/m |\n' +
        '| Light in glass | ω = ck/n(k) | v_p = c/n | v_g = c/(n + ω dn/dω) |\n\n' +
        'In dispersive media, different frequency components travel at different speeds. The **group velocity** v_g = dω/dk gives the speed of the wave *envelope* (the signal carrying information).\n\n' +
        '**Why long ocean swells arrive before choppy waves:** For deep water, v_p ∝ √λ — longer waves travel faster. A distant storm in the Bay of Bengal generates many wavelengths simultaneously. The long-period swells (λ ~ 200 m, v ~ 18 m/s) arrive at the coast hours before the short choppy waves (λ ~ 10 m, v ~ 4 m/s). Fishermen along the Odisha and Andhra coasts read these swell patterns to predict incoming weather.\n\n' +
        '**Quantum connection:** De Broglie matter waves (1924) obey ω = ℏk²/2m. The group velocity v_g = ℏk/m = p/m recovers the classical particle velocity — wave-particle duality is encoded in the dispersion relation.',
      interactive: {
        type: 'python-playground' as const,
        props: {
          starterCode: '# Wave equation calculator: v = f * lambda\n# Try changing these values!\n\nf = 262       # frequency in Hz (middle C)\nv_sound = 343 # speed of sound in air (m/s)\n\nlam = v_sound / f\nprint(f"Frequency: {f} Hz")\nprint(f"Wavelength: {lam:.3f} m")\nprint(f"Period: {1/f*1000:.2f} ms")\n\nprint("\\n--- Electromagnetic spectrum ---")\nc = 3e8  # speed of light\nwaves = [\n    ("FM Radio 100 MHz", 100e6),\n    ("Microwave 2.45 GHz", 2.45e9),\n    ("WiFi 5 GHz", 5e9),\n    ("Red light", 4.3e14),\n    ("Blue light", 7.5e14),\n]\nfor name, freq in waves:\n    wl = c / freq\n    if wl >= 1:\n        print(f"{name}: λ = {wl:.2f} m")\n    elif wl >= 1e-3:\n        print(f"{name}: λ = {wl*100:.2f} cm")\n    elif wl >= 1e-6:\n        print(f"{name}: λ = {wl*1e6:.1f} μm")\n    else:\n        print(f"{name}: λ = {wl*1e9:.0f} nm")',
          title: 'Try it — Wave Equation Calculator',
        },
      },
    },

    // ── Section 3: Interference and Superposition ─────────────
    {
      title: 'Interference and Superposition',
      diagram: 'InterferenceDiagram',
      beginnerContent:
        'When two waves meet, they don\'t bounce off each other — they pass right through. At the point where they overlap, the medium\'s displacement is simply the **sum** of the two individual displacements. This is the **principle of superposition**, and it leads to interference.\n\n' +
        '| Type | What happens | Result |\n' +
        '|------|-------------|--------|\n' +
        '| **Constructive** | Crest meets crest (in phase) | Bigger wave — louder sound, brighter light |\n' +
        '| **Destructive** | Crest meets trough (half-wavelength apart) | Waves cancel — silence, darkness |\n\n' +
        '**Everyday example — noise-cancelling headphones:**\n\n' +
        'A microphone picks up ambient noise. A processor generates the exact inverse wave (shifted by half a wavelength). Your ear receives: original + inverse = **zero**. Noise reduced by up to 30 dB.\n\n' +
        '| Frequency range | Cancellation quality | Why |\n' +
        '|-----------------|---------------------|-----|\n' +
        '| Low (< 500 Hz) — airplane hum, train rumble | Excellent | Long wavelength → easy to match phase |\n' +
        '| Mid (500–2000 Hz) — voices | Moderate | Shorter λ → harder to track in real time |\n' +
        '| High (> 2000 Hz) — sharp sounds | Poor | Wavelength shorter than headphone gaps → phase mismatch |\n\n' +
        '**Musical beats — interference you can hear:**\n\n' +
        'When two notes of *slightly* different frequencies play together — say 440 Hz and 442 Hz — they drift in and out of phase, creating a pulsing "wah-wah-wah" at a rate equal to the frequency difference: **f_beat = |f₁ − f₂| = 2 beats/second**.\n\n' +
        'Musicians use beats to tune instruments: play your note alongside a reference and adjust until the beats disappear — the frequencies have matched. In Assam\'s Bihu orchestras, dhol and pepa players instinctively listen for beats when tuning together before a performance.\n\n' +
        '**Check yourself:** If you hear 5 beats per second when playing your tanpura alongside a 440 Hz tuning fork, what are the two possible frequencies of your tanpura?\n\n' +
        '*Either 435 Hz or 445 Hz — the beat frequency is the difference, and your note could be higher or lower.*',
      intermediateContent:
        '**Path difference determines everything:**\n\n' +
        'For two sources producing waves of equal amplitude A, the resultant at any point depends on the **path difference** Δ = |d₁ − d₂|:\n\n' +
        '| Condition | Path difference | Resultant amplitude | Intensity |\n' +
        '|-----------|----------------|---------------------|----------|\n' +
        '| Constructive | Δ = nλ (n = 0, 1, 2...) | **2A** | **4I₀** |\n' +
        '| Destructive | Δ = (n + ½)λ | **0** | **0** |\n' +
        '| Intermediate | Anything else | Between 0 and 2A | Between 0 and 4I₀ |\n\n' +
        '**Young\'s double-slit experiment — proof that light is a wave:**\n\n' +
        'Light passes through two narrow slits separated by distance d. On a screen at distance D, bright and dark fringes appear. Fringe spacing:\n\n' +
        '> **Δy = λD/d**\n\n' +
        '**Worked example:** λ = 600 nm (orange light), d = 0.2 mm, D = 2 m.\n\n' +
        'Δy = (600 × 10⁻⁹ × 2) / (0.2 × 10⁻³) = **6 mm** between bright fringes.\n\n' +
        'With blue light (λ = 450 nm): Δy = (450 × 10⁻⁹ × 2) / (0.2 × 10⁻³) = **4.5 mm** — fringes closer together. Shorter wavelength → tighter fringe spacing.\n\n' +
        '| Variable changed | Effect on fringe spacing |\n' +
        '|------------------|------------------------|\n' +
        '| Increase wavelength (λ ↑) | Fringes spread apart |\n' +
        '| Increase slit separation (d ↑) | Fringes move closer |\n' +
        '| Increase screen distance (D ↑) | Fringes spread apart |\n' +
        '| Use red instead of blue light | Fringes spread apart (λ_red > λ_blue) |',
      advancedContent:
        '**Michelson interferometry — measuring 10⁻¹⁸ m:**\n\n' +
        'A Michelson interferometer splits a beam, sends the halves along different paths, and recombines them. A path difference change of λ/2 shifts the pattern from bright to dark.\n\n' +
        '| Interferometer | Arm length | Sensitivity | What it measures |\n' +
        '|----------------|-----------|-------------|------------------|\n' +
        '| Classroom demo | 30 cm | ~100 nm | Thermal expansion of metal |\n' +
        '| Precision lab | 1 m | ~1 nm | Refractive index changes |\n' +
        '| LIGO | **4 km** (×280 bounces = 1,120 km effective) | **10⁻¹⁸ m** | Gravitational waves |\n\n' +
        'LIGO detects length changes of 10⁻¹⁸ m — one thousandth of a proton diameter. The laser bounces ~280 times in Fabry-Perot cavities to amplify the signal.\n\n' +
        '**Thin-film interference — colours in soap bubbles and oil slicks:**\n\n' +
        'Light reflecting from the top and bottom surfaces of a thin film interferes. The condition for constructive reflection (when the film has higher n than the surroundings):\n\n' +
        '> **2nt = (m + ½)λ**\n\n' +
        '| Film | Typical thickness | Colours seen | Application |\n' +
        '|------|------------------|-------------|-------------|\n' +
        '| Soap bubble | 200–1000 nm | Rainbow swirls | Demonstrates variable thickness |\n' +
        '| Oil on water | 100–500 nm | Iridescent patches | Pollution indicator |\n' +
        '| Anti-reflection coating | t = λ/(4n) | Lens looks faintly purple | Reduces reflection from ~4% to < 0.5% |\n' +
        '| Butterfly wing scales | ~200 nm | Brilliant structural colour | No pigment — pure interference |\n\n' +
        '**Anti-reflection coatings** use a quarter-wave thickness (t = λ/4n) so reflections from front and back surfaces are half a wavelength apart → destructive interference → reduced glare. Every camera lens and pair of prescription glasses uses this.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'When two waves cancel each other by destructive interference, the energy disappears.', answer: false, explanation: 'Energy is conserved. It is redistributed — regions of destructive interference lose energy, but regions of constructive interference gain it. The total energy remains constant.' },
            { text: 'Noise-cancelling headphones work best against low-frequency sounds like airplane engine hum.', answer: true, explanation: 'Low frequencies have long wavelengths, making it easier for the headphone processor to generate an accurate inverse wave. High frequencies with short wavelengths are harder to cancel precisely.' },
            { text: 'If two musicians play the same note perfectly in tune, you hear beats.', answer: false, explanation: 'Beats occur only when there is a frequency difference. Perfectly matched frequencies give pure constructive interference — a steady, louder tone with no pulsing.' },
            { text: 'In Young\'s double-slit experiment, using red light instead of blue light makes the fringes farther apart.', answer: true, explanation: 'Fringe spacing Δy = λD/d. Red light has a longer wavelength (~700 nm) than blue (~450 nm), so the fringes are more spread out.' },
          ],
        },
      },
    },

    // ── Section 4: Diffraction ────────────────────────────────
    {
      title: 'Diffraction',
      diagram: 'DiffractionDiagram',
      beginnerContent:
        '**Diffraction** is the bending and spreading of waves when they encounter an obstacle or pass through an opening. The golden rule:\n\n' +
        '> Diffraction is strongest when the **gap or obstacle size ≈ wavelength**.\n\n' +
        '| Wave | Wavelength | Diffracts around... |\n' +
        '|------|-----------|---------------------|\n' +
        '| Sound (speech) | 0.2–5 m | Doorways, pillars, furniture — easily |\n' +
        '| AM radio | ~300 m | Hills, mountains — covers valleys |\n' +
        '| FM radio | ~3 m | Less well — blocked by large buildings |\n' +
        '| WiFi 2.4 GHz | 12.5 cm | Doorways — reasonably well |\n' +
        '| WiFi 5 GHz | 6 cm | Less well — blocked by walls more |\n' +
        '| Visible light | 400–700 nm | Almost nothing everyday — sharp shadows |\n\n' +
        '**Why you can hear around corners but not see around them:** Sound wavelengths (0.2–5 m) match doorway and furniture sizes. Light wavelengths (400–700 *nanometres*) are millions of times smaller than everyday objects — diffraction is negligible, so shadows have crisp edges.\n\n' +
        '**Radio waves and mountains:**\n\n' +
        '| Station | Band | Wavelength | Terrain coverage |\n' +
        '|---------|------|-----------|------------------|\n' +
        '| All India Radio AM (Guwahati) | 594 kHz | ~505 m | Reaches valleys and hill stations in Meghalaya — waves bend over ridges |\n' +
        '| AIR FM (Guwahati) | 100.1 MHz | ~3 m | Struggles in Jowai or Tura behind hills — needs relay towers |\n' +
        '| Mobile 4G | ~2.3 GHz | ~13 cm | Poor in remote Arunachal valleys — towers needed every few km |\n\n' +
        '**Check yourself:** Your WiFi router is in the living room. You get good signal through the open doorway but poor signal through a concrete wall. Is this diffraction, absorption, or both?\n\n' +
        '*Both: the 6 cm WiFi wave diffracts through the doorway (gap >> wavelength), but the concrete wall absorbs and reflects the signal. A thinner wooden door would let more through.*',
      intermediateContent:
        '**Single-slit diffraction — the maths:**\n\n' +
        'A single slit of width *a* produces a central bright maximum. The first minimum (dark fringe) appears at:\n\n' +
        '> **sin θ = λ/a**\n\n' +
        '**Worked example 1 — sound through a doorway:**\n\n' +
        'Sound at 500 Hz in air: λ = 343/500 = 0.686 m. Doorway width = 1 m.\n\n' +
        'sin θ = 0.686/1 = 0.686 → θ = **43.3°** — sound spreads widely on the other side. You hear it everywhere.\n\n' +
        '**Worked example 2 — light through a narrow slit:**\n\n' +
        'Red light at 600 nm through a 0.1 mm slit:\n\n' +
        'sin θ = 600 × 10⁻⁹ / 10⁻⁴ = 0.006 → θ = **0.34°** — barely any spreading. Light stays in a tight beam.\n\n' +
        '| Scenario | λ/a ratio | Diffraction angle | Qualitative |\n' +
        '|----------|-----------|-------------------|-----------|\n' +
        '| Sound (500 Hz) through 1 m door | 0.686 | 43.3° | Massive spreading |\n' +
        '| Light (600 nm) through 0.1 mm slit | 0.006 | 0.34° | Negligible spreading |\n' +
        '| Water wave (2 m) through 3 m harbour gap | 0.667 | 41.8° | Strong diffraction into harbour |\n\n' +
        '**The Rayleigh criterion — resolving two objects:**\n\n' +
        'For a circular aperture (camera, telescope, your eye): θ_min = 1.22λ/D\n\n' +
        '| Optical system | D (aperture) | θ_min (at 550 nm) | Can resolve |\n' +
        '|----------------|-------------|-------------------|------------|\n' +
        '| Human eye | 5 mm | 1.34 × 10⁻⁴ rad (28 arcsec) | Car headlights at 5 km |\n' +
        '| Binoculars (50 mm) | 50 mm | 1.34 × 10⁻⁵ rad | 10× sharper than the eye |\n' +
        '| Hubble Space Telescope | 2.4 m | 2.8 × 10⁻⁷ rad | Craters on the Moon |',
      advancedContent:
        '**Fraunhofer diffraction as a Fourier transform:**\n\n' +
        'In the far-field (Fraunhofer) limit, the diffraction pattern is the **Fourier transform** of the aperture function.\n\n' +
        '| Aperture shape | Intensity pattern | Key feature |\n' +
        '|---------------|------------------|-------------|\n' +
        '| Single slit (width *a*) | I(θ) ∝ sinc²(πa sin θ/λ) | Central max + decaying side lobes |\n' +
        '| Circular (diameter D) | I(θ) ∝ [2J₁(πD sin θ/λ) / (πD sin θ/λ)]² | **Airy pattern** — 84% energy in central disk |\n' +
        '| Double slit | sinc² envelope × cos² fringes | Interference modulated by diffraction |\n' +
        '| Diffraction grating (N slits) | Sharp maxima at d sin θ = mλ, width ∝ 1/N | Resolving power R = mN |\n\n' +
        '**X-ray crystallography — diffraction at the atomic scale:**\n\n' +
        'X-rays (λ ~ 0.1 nm) diffract from atomic lattice planes spaced ~0.1–1 nm apart. **Bragg\'s law:**\n\n' +
        '> **2d sin θ = nλ**\n\n' +
        '| Discovery | Year | Diffraction method used |\n' +
        '|-----------|------|-----------------------|\n' +
        '| NaCl crystal structure | 1913 | Bragg X-ray diffraction |\n' +
        '| DNA double helix | 1953 | Rosalind Franklin\'s "Photo 51" — X-ray fibre diffraction |\n' +
        '| Ribosome structure | 2009 | Synchrotron X-ray (Nobel Prize — Ramakrishnan, Steitz, Yonath) |\n' +
        '| Protein folding (AlphaFold) | 2024 | AI trained on millions of X-ray crystallography structures |\n\n' +
        '**Electron diffraction** (LEED, RHEED) uses de Broglie wavelengths of ~0.01–0.1 nm to probe surface atomic structure. Modern synchrotron X-ray sources produce brilliance 10¹² times greater than lab X-ray tubes, enabling protein structure determination at sub-angstrom resolution.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each diffraction concept to its formula or meaning',
          pairs: [
            ['Single slit first minimum', 'sin θ = λ/a — angle depends on wavelength-to-slit ratio'],
            ['Rayleigh criterion', 'θ_min = 1.22λ/D — minimum angle to resolve two point sources'],
            ['Bragg\'s law', '2d sin θ = nλ — X-ray diffraction from crystal planes'],
            ['Diffraction grating maxima', 'd sin θ = mλ — sharp bright lines at specific angles'],
          ],
        },
      },
    },

    // ── Section 5: The Doppler Effect ─────────────────────────
    {
      title: 'The Doppler Effect',
      diagram: 'DopplerEffectDiagram',
      beginnerContent:
        'The **Doppler effect** is the change in observed frequency when a source and observer move relative to each other.\n\n' +
        '**The ambulance siren test:** As an ambulance approaches, its siren sounds higher-pitched. As it recedes, the pitch drops. The driver hears no change — only the stationary listener does.\n\n' +
        '| Situation | Wavefronts | Observed frequency | Observed pitch |\n' +
        '|-----------|-----------|-------------------|----------------|\n' +
        '| Source approaching | **Compressed** (shorter λ) | Higher than emitted | Higher pitch |\n' +
        '| Source stationary | Normal spacing | Same as emitted | Normal pitch |\n' +
        '| Source receding | **Stretched** (longer λ) | Lower than emitted | Lower pitch |\n\n' +
        '**Everyday Doppler:**\n\n' +
        '| Situation | What you hear |\n' +
        '|-----------|---------------|\n' +
        '| A Brahmaputra ferry horn approaching a ghat | Pitch rises as the ferry nears, drops as it passes |\n' +
        '| A Rajdhani Express passing through a station | Dramatic pitch drop as the horn swoops from high to low |\n' +
        '| Bihu dhol players marching toward you then away | Subtle pitch shift — the dhol sounds slightly higher when approaching |\n\n' +
        '**The Doppler effect works for light too:**\n\n' +
        'In 1929, Edwin Hubble measured the **redshift** of distant galaxies and discovered nearly all are moving away from us — the farther away, the faster they recede. This was the first evidence that the **universe is expanding**.\n\n' +
        '| Motion | Light shift | Colour change |\n' +
        '|--------|-----------|---------------|\n' +
        '| Toward observer | **Blueshift** (shorter λ) | Toward blue/violet |\n' +
        '| Away from observer | **Redshift** (longer λ) | Toward red |\n\n' +
        '**Practical uses:**\n\n' +
        '- **Police radar guns** — bounce microwaves off a car, measure frequency shift → calculate speed\n' +
        '- **Weather radar** — measure raindrop speeds to track monsoon intensity. The IMD station in Guwahati uses Doppler radar to map storm cells moving across the Brahmaputra valley\n' +
        '- **Medical ultrasound** — Doppler imaging measures blood flow speed through arteries',
      intermediateContent:
        '**The Doppler formula for sound:**\n\n' +
        '> **f_obs = f_s × (v ± v_obs) / (v ∓ v_src)**\n\n' +
        'Upper signs: source and observer approaching. Lower signs: receding.\n\n' +
        '**Worked example 1 — approaching ambulance:**\n\n' +
        'f_s = 700 Hz, v_src = 30 m/s, v_sound = 343 m/s.\n\n' +
        'f_obs = 700 × 343/(343 − 30) = 700 × 343/313 = **767 Hz** ✓ (higher pitch)\n\n' +
        '**Worked example 2 — receding ambulance:**\n\n' +
        'f_obs = 700 × 343/(343 + 30) = 700 × 343/373 = **644 Hz** ✓ (lower pitch)\n\n' +
        '| Quantity | Approaching | Receding |\n' +
        '|----------|-----------|----------|\n' +
        '| Observed frequency | **767 Hz** | **644 Hz** |\n' +
        '| Ratio (approach/recede) | 767/644 = **1.19** | — |\n' +
        '| Musical interval | Nearly a minor third | — |\n\n' +
        '**Worked example 3 — police radar:**\n\n' +
        'A 24 GHz radar beam reflects from a car at 100 km/h (27.8 m/s). The Doppler shift is:\n\n' +
        'Δf = 2f(v/c) = 2 × 24 × 10⁹ × 27.8 / (3 × 10⁸) = **4,448 Hz**\n\n' +
        'The radar measures this 4.4 kHz shift and converts it to speed — accurate to ±2 km/h.\n\n' +
        '**Worked example 4 — Hubble\'s law and galaxy redshift:**\n\n' +
        'Hubble\'s law: **v = H₀d**, where H₀ ≈ 70 km/s/Mpc.\n\n' +
        '| Galaxy distance | Recession speed | Redshift z = v/c |\n' +
        '|----------------|----------------|------------------|\n' +
        '| 10 Mpc | 700 km/s | 0.0023 (0.23%) |\n' +
        '| 100 Mpc | 7,000 km/s | 0.023 (2.3%) |\n' +
        '| 1,000 Mpc | 70,000 km/s | 0.23 (23%) |\n' +
        '| 4,200 Mpc (edge of observable) | 294,000 km/s | ~1100 (CMB) |',
      advancedContent:
        '**The relativistic Doppler effect:**\n\n' +
        'For light, there is no medium, so the classical formula doesn\'t apply. The relativistic formula:\n\n' +
        '> **f_obs = f_s × √[(1 + β)/(1 − β)]**, where β = v/c\n\n' +
        '**The transverse Doppler effect** — unique to relativity:\n\n' +
        'When the source moves perpendicular to the line of sight, classical physics predicts no shift. Relativity predicts a **redshift** due to time dilation:\n\n' +
        '> **f_obs = f_s / γ**, where γ = 1/√(1 − v²/c²)\n\n' +
        'This was confirmed by the Ives-Stilwell experiment (1938) using fast-moving hydrogen ions.\n\n' +
        '| Doppler type | Formula | Physical cause |\n' +
        '|-------------|---------|----------------|\n' +
        '| Classical (sound) | f_obs = f_s(v ± v_obs)/(v ∓ v_src) | Compression/stretching of wavefronts |\n' +
        '| Relativistic (radial) | f_obs = f_s √[(1+β)/(1−β)] | Wavefront compression + time dilation |\n' +
        '| Transverse (perpendicular) | f_obs = f_s/γ | **Pure time dilation** — no classical analogue |\n\n' +
        '**Doppler broadening** of spectral lines: In a hot gas, atoms move at various speeds along the line of sight, each Doppler-shifting the emitted light slightly. The resulting line width:\n\n' +
        'Δf/f = √(8kT ln2 / mc²)\n\n' +
        'For hydrogen at 6,000 K (the Sun\'s surface): Δf/f ≈ 4 × 10⁻⁵ → wavelength spread of ~0.03 nm. Astrophysicists use this broadening to measure stellar temperatures.\n\n' +
        '**Doppler cooling** of atoms (Nobel Prize 1997 — Chu, Cohen-Tannoudji, Phillips):\n\n' +
        '| Step | What happens |\n' +
        '|------|-------------|\n' +
        '| Laser tuned slightly *below* atomic transition | Stationary atoms don\'t absorb (frequency too low) |\n' +
        '| Atom moves *toward* the laser | Sees the light blueshifted into resonance → absorbs photon → momentum kick slows it down |\n' +
        '| Atom moves *away* from the laser | Sees the light further redshifted → doesn\'t absorb → unaffected |\n' +
        '| Six beams from all directions | Atoms are slowed regardless of direction → cooled to **microkelvin temperatures** |\n\n' +
        'Doppler cooling is the first step toward Bose-Einstein condensation — a state of matter where atoms behave as a single quantum wave.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'The Guwahati Doppler Weather Radar (DWR) can detect the speed and direction of raindrops inside storm cells up to 250 km away — crucial for tracking cyclones moving up the Brahmaputra valley.',
            'When a source moves faster than the speed of sound (Mach > 1), the Doppler-shifted wavefronts pile up into a shock wave — the "sonic boom" heard when military jets break the sound barrier over Tezpur Air Force Station.',
            'Astronomers discovered the first exoplanet (51 Pegasi b, 1995) by measuring tiny Doppler shifts in the star\'s light as the planet\'s gravity tugged it back and forth — a wobble of just 50 m/s.',
            'Bats use the Doppler effect to track prey in flight: a moth moving toward the bat shifts the echo to a higher frequency, and the bat adjusts its call to compensate — a biological Doppler radar.',
          ],
        },
      },
    },
  ],
};
