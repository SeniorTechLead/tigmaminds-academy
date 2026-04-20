import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'sound-and-vibration',
  title: 'Sound & Vibration',
  category: 'physics',
  icon: '🔊',
  tagline: 'How vibrations become music, speech, and the roar of a river.',
  relatedStories: ['bamboo-taught-wind', 'bamboo-flute-of-nagaland', 'dhol-drum', 'music-dimasa', 'frogs-sing-rain', 'mountain-echoes'],
  understand: [
    // ── Section 1: What Is Sound? ──────────────────────────────────
    {
      title: 'What Is Sound?',
      diagram: 'TransverseLongitudinalDiagram',
      beginnerContent:
        'Clap your hands. That sharp *crack* reaches your friend\'s ears even though nothing visible travels between you. What happened? Your palms slammed together, pushing the air molecules nearest your hands closer together. Those squeezed molecules pushed the next ones, which pushed the next, creating an invisible chain reaction — a **sound wave**.\n\n' +
        'Sound is a **longitudinal wave** — the molecules vibrate back and forth in the *same direction* the wave travels (unlike a water wave, where molecules move up and down while the wave travels sideways).\n\n' +
        '**Analogy — the Bihu dhol:** When a drummer strikes the dhol, the cowhide membrane vibrates inward and outward hundreds of times per second. Each outward push creates a **compression** (molecules packed tightly), and each inward pull creates a **rarefaction** (molecules spread apart). These alternating compressions and rarefactions ripple outward through the air like a chain of dominoes.\n\n' +
        '| Sound property | What it means | Everyday analogy |\n' +
        '|----------------|--------------|------------------|\n' +
        '| **Compression** | Air molecules pushed close together | A crowd squeezed at a Bihu dance entrance |\n' +
        '| **Rarefaction** | Air molecules spread apart | The crowd fanning out once inside the field |\n' +
        '| **Wavelength (λ)** | Distance between two compressions | Spacing between waves on the Brahmaputra |\n' +
        '| **Frequency (f)** | Number of compressions per second | How many drum beats per second |\n' +
        '| **Amplitude** | How tightly molecules are packed | How hard the drummer hits |\n\n' +
        'Unlike light, **sound cannot travel through a vacuum**. There are no molecules to push in empty space — which is why outer space is silent, no matter how dramatic the movie explosion looks.\n\n' +
        '**Sound needs a medium:**\n\n' +
        '| Medium | Can sound travel? | Why? |\n' +
        '|--------|------------------|------|\n' +
        '| Air | Yes | Gas molecules collide and transmit vibrations |\n' +
        '| Water | Yes (4× faster) | Liquid molecules are closer together — vibrations pass faster |\n' +
        '| Steel | Yes (17× faster) | Atoms in solids are tightly bonded — vibrations zip through |\n' +
        '| Bamboo | Yes | Fibrous structure transmits vibrations efficiently |\n' +
        '| Vacuum (space) | **No** | No molecules at all — nothing to push |\n\n' +
        '**Check yourself:** If you see a lightning flash and count 3 seconds before hearing thunder, the storm is roughly 1 km away (because sound takes about 3 seconds to travel 1 km in air).',
      intermediateContent:
        '**The fundamental wave equation:**\n\n' +
        '`v = fλ`\n\n' +
        'where v = speed of sound (m/s), f = frequency (Hz), and λ = wavelength (m).\n\n' +
        '**Worked example 1 — Concert A:** A tuning fork vibrates at 440 Hz. In air at 20°C (v = 343 m/s):\n\n' +
        '`λ = v / f = 343 / 440 = 0.78 m` — shorter than your arm.\n\n' +
        '**Worked example 2 — Bass rumble at a Bihu concert:** A bass drum produces a 50 Hz thump:\n\n' +
        '`λ = 343 / 50 = 6.86 m` — nearly 7 metres long! That\'s why you *feel* bass in your chest.\n\n' +
        '**Worked example 3 — Ultrasound bat call:** A bat\'s echolocation pulse at 50,000 Hz:\n\n' +
        '`λ = 343 / 50,000 = 0.00686 m = 6.86 mm` — tiny wavelength, enabling detection of small insects.\n\n' +
        '| Quantity | Symbol | Unit | Formula |\n' +
        '|----------|--------|------|---------|\n' +
        '| Speed | v | m/s | v = fλ |\n' +
        '| Frequency | f | Hz (s⁻¹) | f = v/λ |\n' +
        '| Wavelength | λ | m | λ = v/f |\n' +
        '| Period | T | s | T = 1/f |\n' +
        '| Angular frequency | ω | rad/s | ω = 2πf |\n' +
        '| Wave number | k | rad/m | k = 2π/λ |\n\n' +
        '**Speed of sound in air depends on temperature:**\n\n' +
        '`v = 331 + 0.6T` (where T is in °C)\n\n' +
        '| Condition | Temperature | Speed of sound |\n' +
        '|-----------|------------|----------------|\n' +
        '| Cold winter morning, Tezpur | 10°C | 331 + 6 = **337 m/s** |\n' +
        '| Room temperature | 20°C | 331 + 12 = **343 m/s** |\n' +
        '| Hot Assam summer | 35°C | 331 + 21 = **352 m/s** |\n' +
        '| Boiling point | 100°C | 331 + 60 = **391 m/s** |\n\n' +
        '**Inverse square law:** Sound intensity drops with distance: **I = P/(4πr²)**.\n\n' +
        'A dhol drummer producing 0.5 W of sound power:\n' +
        '- At 1 m: I = 0.5 / (4π × 1) = **0.040 W/m²**\n' +
        '- At 5 m: I = 0.5 / (4π × 25) = **0.0016 W/m²** (25× weaker)\n' +
        '- At 10 m: I = 0.5 / (4π × 100) = **0.0004 W/m²** (100× weaker)\n\n' +
        'Double your distance → intensity drops to **1/4**.',
      advancedContent:
        '**The 3D wave equation for sound:**\n\n' +
        '`∂²p/∂t² = c²∇²p`\n\n' +
        'where p is pressure variation (acoustic pressure) and c is sound speed. Solutions include:\n\n' +
        '| Wave type | Solution | Characteristics |\n' +
        '|-----------|----------|----------------|\n' +
        '| Plane wave | p = A sin(kx − ωt) | Amplitude constant — infinite flat wavefronts |\n' +
        '| Spherical wave | p = (A/r) sin(kr − ωt) | Amplitude decays as 1/r — point source |\n' +
        '| Cylindrical wave | p = (A/√r) sin(kr − ωt) | Amplitude decays as 1/√r — line source |\n' +
        '| Standing wave | p = 2A sin(kx) cos(ωt) | Nodes and antinodes — zero net energy transport |\n\n' +
        '**Deriving the speed of sound in a gas from thermodynamics:**\n\n' +
        '`c = √(γRT/M)`\n\n' +
        'where γ = adiabatic index (ratio of specific heats), R = 8.314 J/(mol·K), T = absolute temperature, M = molar mass.\n\n' +
        '| Gas | γ | M (g/mol) | c at 20°C (m/s) | Why? |\n' +
        '|-----|---|-----------|-----------------|------|\n' +
        '| Helium | 1.67 | 4 | 1,007 | Light + monatomic → fast |\n' +
        '| Air (N₂/O₂) | 1.40 | 29 | 343 | Standard reference |\n' +
        '| CO₂ | 1.30 | 44 | 267 | Heavy + triatomic → slow |\n' +
        '| SF₆ | 1.09 | 146 | 134 | Very heavy → very slow |\n\n' +
        'This explains the helium voice effect: lighter molecules → higher c → higher resonant frequencies in your vocal tract → squeaky voice. Conversely, SF₆ gives a deep "demon voice."\n\n' +
        '**Nonlinear acoustics:** At high amplitudes, the speed of sound increases with pressure (compressions travel faster than rarefactions), so wave crests catch up to troughs, steepening into **shock waves** with the characteristic N-wave pressure profile of a sonic boom. The Rankine-Hugoniot relations govern the discontinuity across the shock front.\n\n' +
        '**Acoustic phonons** — in solid-state physics, sound is quantised as phonons with energy E = ℏω and momentum p = ℏk. Their Bose-Einstein statistics determine the specific heat of solids (Debye model), explaining why specific heat → 0 as T → 0 K.',
    },

    // ── Section 2: Frequency and Pitch ─────────────────────────────
    {
      title: 'Frequency and Pitch',
      diagram: 'SineWaveDiagram',
      beginnerContent:
        'Frequency is the number of complete vibrations (cycles) per second, measured in **Hertz (Hz)**. One vibration per second = 1 Hz.\n\n' +
        'A tuning fork vibrating **440 times per second** produces the musical note A above middle C — we say its frequency is 440 Hz. Higher frequency = higher pitch. Lower frequency = lower pitch.\n\n' +
        '**Analogy — the bamboo flute of Nagaland:** When a Naga musician blows across the flute\'s opening, the air column inside vibrates. A long flute produces a low-pitched, mellow tone (low frequency). A short flute produces a higher-pitched, brighter tone (high frequency). By opening and closing finger holes, the musician changes the *effective length* of the vibrating air column, changing the pitch.\n\n' +
        '| Source | Approximate frequency | Pitch |\n' +
        '|--------|----------------------|-------|\n' +
        '| Lowest note on a bass guitar | 41 Hz | Very deep rumble |\n' +
        '| Bihu dhol (fundamental) | 80–150 Hz | Deep, resonant boom |\n' +
        '| Male speaking voice | 85–180 Hz | Low–mid |\n' +
        '| Female speaking voice | 165–255 Hz | Mid |\n' +
        '| Concert A (tuning reference) | 440 Hz | Mid-high |\n' +
        '| Bamboo flute (Nagaland, high note) | 800–2,000 Hz | High, bright |\n' +
        '| Piccolo (highest orchestral note) | ~4,000 Hz | Very high, piercing |\n' +
        '| Highest note humans can hear | ~20,000 Hz | Extreme treble |\n\n' +
        '**The hearing range of different animals:**\n\n' +
        '| Animal | Hearing range | NE India context |\n' +
        '|--------|--------------|------------------|\n' +
        '| Human | 20–20,000 Hz | Upper limit drops with age — teens hear 18 kHz, elders ~12 kHz |\n' +
        '| Dog | 67–45,000 Hz | Street dogs in Guwahati hear frequencies you cannot |\n' +
        '| Cat | 48–85,000 Hz | Fishing cats in Kaziranga hear ultrasonic rodent calls |\n' +
        '| Bat | 2,000–110,000 Hz | Insectivorous bats in Manas use ultrasound to hunt |\n' +
        '| Elephant | 16–12,000 Hz | Kaziranga elephants communicate with infrasound below 20 Hz |\n' +
        '| Dolphin (Gangetic) | 150–150,000 Hz | Nearly blind — uses sonar clicks to navigate muddy Brahmaputra |\n\n' +
        '**Prediction:** If you could shrink a bamboo flute to half its length, what would happen to its pitch? (Answer: it would roughly double — one octave higher.)',
      intermediateContent:
        '**Vibrating string frequency — the guitar/sitar equation:**\n\n' +
        '`f = (1/2L) × √(T/μ)`\n\n' +
        'where L = vibrating length (m), T = tension (N), μ = mass per unit length (kg/m).\n\n' +
        '**Worked example 1 — Guitar string:**\n' +
        'L = 0.65 m, T = 70 N, μ = 0.001 kg/m\n' +
        'f = (1/1.3) × √(70,000) = 0.769 × 264.6 = **203.5 Hz** (roughly G3)\n\n' +
        '**Worked example 2 — Press at the 12th fret** (halve the length):\n' +
        'L = 0.325 m → f = (1/0.65) × 264.6 = **407 Hz** — exactly one **octave** higher (frequency doubled).\n\n' +
        '**Worked example 3 — Assamese dotara string:**\n' +
        'L = 0.50 m, T = 40 N, μ = 0.0008 kg/m\n' +
        'f = (1/1.0) × √(50,000) = 1.0 × 223.6 = **223.6 Hz** (roughly A3)\n\n' +
        '| What you change | Effect on frequency | Musical result |\n' +
        '|-----------------|--------------------|---------|\n' +
        '| Halve the length (L/2) | f doubles (×2) | One octave up |\n' +
        '| Double the tension (2T) | f increases by √2 (×1.41) | Slightly more than a fourth up |\n' +
        '| Double mass per length (2μ) | f decreases by √2 (×0.71) | Slightly more than a fourth down |\n' +
        '| Thicker string | Higher μ → lower f | Bass strings are thick and heavy |\n\n' +
        '**Open vs closed pipes:**\n\n' +
        '| Pipe type | Harmonics present | Frequency formula | Example |\n' +
        '|-----------|-------------------|-------------------|----------|\n' +
        '| Open (both ends open) | All: 1, 2, 3, 4... | f_n = nv/(2L) | Bamboo flute, pepa |\n' +
        '| Closed (one end sealed) | Odd only: 1, 3, 5... | f_n = nv/(4L) | Bottle with one open end |\n\n' +
        '**Worked example 4 — Bamboo flute (open pipe):**\n' +
        'L = 0.30 m (30 cm), v = 343 m/s\n' +
        'f₁ = 343 / (2 × 0.30) = **572 Hz** (approximately D5)\n' +
        'f₂ = 2 × 572 = **1,144 Hz** (D6 — one octave higher)\n' +
        'f₃ = 3 × 572 = **1,716 Hz** (A6 — a fifth above the second harmonic)\n\n' +
        'The full set of harmonics is what gives each instrument its unique **timbre** (tonal colour).',
      advancedContent:
        '**Pitch perception is logarithmic, not linear:**\n\n' +
        'The **mel scale** (Stevens, 1937) quantifies perceived pitch:\n\n' +
        '`mel = 2595 × log₁₀(1 + f/700)`\n\n' +
        '| Frequency (Hz) | Mel value | Perceived pitch |\n' +
        '|----------------|-----------|----------------|\n' +
        '| 125 | 220 | Low — bass range |\n' +
        '| 500 | 607 | Mid — male voice fundamental |\n' +
        '| 1,000 | 1,000 | Reference point |\n' +
        '| 2,000 | 1,497 | Upper speech range |\n' +
        '| 4,000 | 2,146 | High — consonant clarity |\n' +
        '| 8,000 | 2,840 | Very high — treble "air" |\n\n' +
        'Notice that doubling frequency does NOT double the mel value above ~1 kHz. This is why musical scales are defined by frequency *ratios*, not absolute differences.\n\n' +
        '**Place theory of hearing (Helmholtz/Bekesy):**\n\n' +
        'Different frequencies excite different positions along the **basilar membrane** in the cochlea:\n\n' +
        '| Location on basilar membrane | Width | Stiffness | Frequencies detected |\n' +
        '|-----------------------------|-------|-----------|---------------------|\n' +
        '| Base (near oval window) | Narrow (0.04 mm) | Very stiff | High: 20,000 Hz |\n' +
        '| Middle | Medium | Moderate | Mid: 1,000–4,000 Hz |\n' +
        '| Apex (helicotrema) | Wide (0.5 mm) | Flexible | Low: 20–200 Hz |\n\n' +
        'The basilar membrane acts as a **mechanical Fourier analyser**, decomposing complex sounds into frequency components. Modern **cochlear implants** exploit this by placing electrodes at different positions to stimulate specific frequency channels — typically 12–22 channels.\n\n' +
        '**Otoacoustic emissions (OAEs):** The cochlea is not passive. **Outer hair cells** actively amplify weak signals by ~40 dB through electromotility — they change length in response to voltage, a piezoelectric-like effect unique to mammalian hearing. These active vibrations leak back out as faint sounds (OAEs) detectable with a microphone in the ear canal. Neonatal hearing screening in Assam\'s hospitals now uses OAE tests.\n\n' +
        '**Musical tuning systems** rest on the tension between pure harmonic ratios and practical keyboard layout:\n\n' +
        '| System | Principle | Problem |\n' +
        '|--------|----------|--------|\n' +
        '| Pythagorean | Stack fifths (3:2 ratio) | "Wolf" intervals — some keys sound terrible |\n' +
        '| Just intonation | Pure integer ratios | Beautiful in one key, awful in others |\n' +
        '| Equal temperament | 12th root of 2 between semitones | Every key equally *slightly* out of tune |\n' +
        '| Indian raga tuning | Shruti microtones (22 per octave) | Richer than 12-tone — but fixed instruments struggle |',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each NE India sound source to its approximate frequency range',
          pairs: [
            ['Bihu dhol (deep beat)', '80–150 Hz — low, resonant rumble you feel in your chest'],
            ['Bamboo flute (Nagaland)', '500–2,000 Hz — bright, singing mid-range tones'],
            ['Pepa (buffalo horn)', '200–600 Hz — buzzy, reedy mid-low range'],
            ['Tokari (single-string folk instrument)', '150–400 Hz — warm fundamental with rich overtones'],
          ],
        },
      },
    },

    // ── Section 3: Amplitude, Volume, and the Decibel Scale ────────
    {
      title: 'Amplitude, Volume & the Decibel Scale',
      beginnerContent:
        'While frequency controls **pitch** (how high or low), amplitude controls **volume** (how loud or soft). Amplitude is how far the air molecules are pushed from their resting position — bigger pushes = louder sound.\n\n' +
        '**Analogy — the dhol player\'s hands:** A gentle tap on the dhol produces a quiet sound (small amplitude). A full-strength *thwack* produces a thunderous boom (large amplitude). Same drum, same pitch, completely different loudness.\n\n' +
        'Volume is measured in **decibels (dB)**, and here is the crucial thing: the decibel scale is **logarithmic**, not linear. Every increase of **10 dB** means the sound is **ten times** more intense.\n\n' +
        '| Sound source | Decibels (dB) | How it feels |\n' +
        '|-------------|--------------|-------------|\n' +
        '| Rustling leaves | 10 dB | Barely audible |\n' +
        '| Whispering | 30 dB | Very quiet |\n' +
        '| Normal conversation | 60 dB | Comfortable |\n' +
        '| Busy Guwahati traffic | 75–85 dB | Loud, tiring over time |\n' +
        '| Bihu dhol at 1 metre | ~95 dB | Very loud — ear protection wise |\n' +
        '| Auto-rickshaw horn | ~100 dB | Painfully loud up close |\n' +
        '| Full Rongali Bihu stage with amplifiers | ~110 dB | Risk of hearing damage |\n' +
        '| Jet engine at 30 m | 130 dB | Threshold of pain |\n' +
        '| Rocket launch at 50 m | 180 dB | Instant hearing destruction |\n\n' +
        '**Understanding the logarithmic scale:**\n\n' +
        '| dB increase | Intensity change | Perceived loudness |\n' +
        '|------------|-----------------|-------------------|\n' +
        '| +3 dB | 2× more intense | Just barely noticeably louder |\n' +
        '| +10 dB | 10× more intense | Sounds "twice as loud" |\n' +
        '| +20 dB | 100× more intense | Sounds "four times as loud" |\n' +
        '| +30 dB | 1,000× more intense | Dramatically louder |\n\n' +
        'This means a Bihu dhol at 95 dB is not "a little louder" than a conversation at 60 dB — it is **3,500 times** more intense! Prolonged exposure to sounds above **85 dB** can cause **permanent hearing damage**.\n\n' +
        '**Protect your ears:** At Rongali Bihu festivals where amplified music can exceed 100 dB, standing far from the speakers or wearing earplugs is genuinely important — hearing damage is cumulative and irreversible.',
      intermediateContent:
        '**The decibel formula:**\n\n' +
        '`dB = 10 × log₁₀(I / I₀)`\n\n' +
        'where I₀ = 10⁻¹² W/m² (the threshold of human hearing — an astonishingly small amount of energy).\n\n' +
        '**Worked example 1 — Normal conversation:**\n' +
        'I = 10⁻⁶ W/m²\n' +
        'dB = 10 × log₁₀(10⁻⁶ / 10⁻¹²) = 10 × log₁₀(10⁶) = 10 × 6 = **60 dB** ✓\n\n' +
        '**Worked example 2 — Combining sources:**\n' +
        'Two identical dhols playing together: total intensity doubles.\n' +
        'ΔdB = 10 × log₁₀(2) = 10 × 0.301 = **+3 dB** (not double!)\n' +
        'Ten dhols: ΔdB = 10 × log₁₀(10) = **+10 dB**\n\n' +
        '**Worked example 3 — Distance effect:**\n' +
        'A pepa player produces 90 dB at 1 m. What is the level at 10 m?\n' +
        'Intensity drops by 1/r², so at 10 m: I₁₀ = I₁ / 100\n' +
        'ΔdB = 10 × log₁₀(1/100) = 10 × (−2) = **−20 dB**\n' +
        'Level at 10 m = 90 − 20 = **70 dB**\n\n' +
        '| Formula variant | Equation | When to use |\n' +
        '|-----------------|----------|------------|\n' +
        '| Intensity level | dB = 10 × log₁₀(I/I₀) | When given power per area (W/m²) |\n' +
        '| Sound pressure level | dB_SPL = 20 × log₁₀(p/p₀) | When given pressure (Pa); p₀ = 20 μPa |\n' +
        '| Combining sources | dB_total = dB₁ + 10 × log₁₀(N) | N identical sources |\n' +
        '| Distance correction | ΔdB = −20 × log₁₀(r₂/r₁) | Point source, outdoors |\n\n' +
        'Note the factor of **20** (not 10) in the pressure formula — because intensity is proportional to pressure **squared**: I ∝ p², so 10 × log(p²) = 20 × log(p).\n\n' +
        '**Worked example 4 — Pressure to dB:**\n' +
        'A sound wave has pressure amplitude p = 1 Pa.\n' +
        'dB_SPL = 20 × log₁₀(1 / 0.00002) = 20 × log₁₀(50,000) = 20 × 4.7 = **94 dB SPL**\n\n' +
        '| Exposure level | Safe duration (NIOSH) | Example |\n' +
        '|---------------|----------------------|------------------|\n' +
        '| 85 dB | 8 hours | Busy market in Jorhat |\n' +
        '| 88 dB | 4 hours | Auto-rickshaw ride |\n' +
        '| 91 dB | 2 hours | Roadside dhaba near highway |\n' +
        '| 94 dB | 1 hour | Dhol practice session |\n' +
        '| 100 dB | 15 minutes | Close to amplified Bihu stage |\n' +
        '| 110 dB | < 2 minutes | Standing next to speaker stack |',
      advancedContent:
        '**Fletcher-Munson curves (equal-loudness contours, ISO 226:2003):**\n\n' +
        'Human loudness perception is **not flat** across frequencies. At low volumes, we are far more sensitive to mid-frequencies (~2–5 kHz, where speech consonants live) than to bass or treble.\n\n' +
        '| Frequency | SPL needed to match perceived loudness of 40 dB at 1 kHz |\n' +
        '|-----------|----------------------------------------------------------|\n' +
        '| 50 Hz | ~60 dB (bass needs a 20 dB boost to sound equally loud) |\n' +
        '| 100 Hz | ~50 dB |\n' +
        '| 1,000 Hz | 40 dB (reference) |\n' +
        '| 3,500 Hz | ~32 dB (ear canal resonance — we are *extra* sensitive here) |\n' +
        '| 10,000 Hz | ~48 dB |\n\n' +
        'This explains why music sounds "thin" at low volumes — bass perception drops disproportionately. The "loudness" button on old stereos applied a bass boost to compensate.\n\n' +
        '**Loudness scales:**\n\n' +
        '| Scale | Unit | Definition | Key property |\n' +
        '|-------|------|-----------|-------------|\n' +
        '| dB SPL | decibel | 20 × log₁₀(p/p₀) | Objective, physical |\n' +
        '| Phon | phon | dB SPL at 1 kHz for equal perceived loudness | Frequency-corrected |\n' +
        '| Sone | sone | 1 sone = 40 phons | **Linear**: 2 sones = twice as loud |\n\n' +
        '**Acoustic impedance** determines energy transfer between media:\n\n' +
        '`Z = ρc` (density × speed of sound)\n\n' +
        '| Medium | Z (Pa·s/m) | Result at boundary |\n' +
        '|--------|-----------|-------------------|\n' +
        '| Air | 415 | Reference |\n' +
        '| Water | 1.48 × 10⁶ | Air→water: **99.9% reflects** — underwater sounds are muffled from above |\n' +
        '| Bone | 7.4 × 10⁶ | Bone conduction: vibrations bypass the eardrum (how bone-conduction headphones work) |\n' +
        '| Steel | 4.7 × 10⁷ | Excellent sound transmission — engineers hear flaws by tapping |\n\n' +
        'The **transmission coefficient** at normal incidence is:\n\n' +
        '`T = 4Z₁Z₂ / (Z₁ + Z₂)²`\n\n' +
        'For air→water: T = 4 × 415 × 1.48×10⁶ / (415 + 1.48×10⁶)² ≈ **0.001** — only 0.1% of energy crosses. This massive impedance mismatch is why the **middle ear** (ossicles: hammer, anvil, stirrup) exists: it mechanically amplifies vibrations by ~22× to overcome the air-to-fluid mismatch at the cochlea.',
      interactive: {
        type: 'slider',
        props: {},
      },
    },

    // ── Section 4: Resonance — When Vibrations Amplify ─────────────
    {
      title: 'Resonance — When Vibrations Amplify',
      diagram: 'ResonanceDiagram',
      beginnerContent:
        'Every object has a **natural frequency** at which it "wants" to vibrate. Push a child on a swing at exactly the right rhythm, and each push adds energy — the swing goes higher and higher. Push at the wrong rhythm, and your pushes fight the swing\'s natural motion. Pushing at the *right* rhythm is **resonance**.\n\n' +
        '**Analogy — the Bihu dhol player\'s rhythm:** When a dhol drummer finds the right beat that makes the drumhead "sing" — the membrane vibrating at its natural frequency — the drum produces maximum volume with minimum effort. An out-of-rhythm strike wastes energy and sounds muffled.\n\n' +
        '| Resonance example | What vibrates | Natural frequency driven by |\n' +
        '|-------------------|--------------|----------------------------|\n' +
        '| Child on a swing | Swing + child | Length of chains, weight |\n' +
        '| Opera singer shatters glass | Wine glass | Shape, thickness, material |\n' +
        '| Bamboo flute produces clear note | Air column inside bamboo | Length of tube, open/closed holes |\n' +
        '| Bridge swaying in wind | Bridge structure | Mass, stiffness, span length |\n' +
        '| Blowing across a bottle top | Air in the bottle | Volume of air inside |\n\n' +
        '**How a bamboo flute uses resonance:** The column of air inside the flute resonates at specific frequencies determined by the tube\'s length and the positions of the finger holes. Open a hole and you change the effective air column length, which changes the resonant frequency, which changes the note. The bamboo itself also resonates at certain frequencies, giving the flute its distinctive warm tone — metal flutes sound brighter because metal resonates differently.\n\n' +
        '| Instrument | What resonates | What controls the frequency |\n' +
        '|-----------|---------------|----------------------------|\n' +
        '| Bamboo flute | Air column | Finger holes (change effective tube length) |\n' +
        '| Dhol | Cowhide membrane | Drumhead tension, diameter |\n' +
        '| Dotara (Assamese 2-string) | Strings + wooden body | String length, tension, body shape |\n' +
        '| Pepa (buffalo horn) | Reed + horn cavity | Reed stiffness, horn length and flare |\n\n' +
        '**Resonance can be dangerous:** The Tacoma Narrows Bridge in Washington, USA (1940) collapsed when wind gusts matched one of the bridge\'s natural frequencies. The vibrations grew and grew until the structure tore itself apart — a dramatic warning that engineers must account for resonance in every design.',
      intermediateContent:
        '**The spring-mass resonance formula:**\n\n' +
        '`f₀ = (1/2π) × √(k/m)`\n\n' +
        'where k = stiffness (N/m) and m = mass (kg).\n\n' +
        '**Worked example 1 — Wine glass:**\n' +
        'k ≈ 40,000 N/m, m = 0.1 kg\n' +
        'f₀ = (1/2π) × √(400,000) = (1/6.28) × 632.5 = **100.7 Hz**\n\n' +
        '**Worked example 2 — Bamboo flute (open pipe resonance):**\n' +
        'L = 0.60 m, v = 343 m/s\n' +
        'Resonant wavelengths: λ_n = 2L/n (n = 1, 2, 3...)\n' +
        'λ₁ = 1.2 m → f₁ = 343/1.2 = **286 Hz** (roughly D4)\n' +
        'λ₂ = 0.6 m → f₂ = 343/0.6 = **572 Hz** (D5 — octave up)\n' +
        'λ₃ = 0.4 m → f₃ = 343/0.4 = **858 Hz** (A5 — fifth above D5)\n\n' +
        '**The Quality Factor (Q):**\n\n' +
        'Q = f₀/Δf, where Δf is the bandwidth at half-maximum power. It measures how *sharp* and *sustained* the resonance is.\n\n' +
        '| System | Typical Q | What it means |\n' +
        '|--------|----------|---------------|\n' +
        '| Wine glass | ~1,000 | Extremely sharp — energy builds enormously (can shatter) |\n' +
        '| Guitar string | ~500 | Notes ring for several seconds |\n' +
        '| Bamboo flute air column | ~50–100 | Moderate sustain, warm tone |\n' +
        '| Dhol drumhead | ~5–15 | Very broad — note dies quickly (percussive) |\n' +
        '| Room mode (standing wave) | ~3–10 | Boomy bass at certain spots in the room |\n\n' +
        'Higher Q means:\n' +
        '- The resonance peak is narrower (more frequency-selective)\n' +
        '- Energy builds up more (higher amplitude at resonance)\n' +
        '- The vibration rings for longer after the driving force stops\n\n' +
        '| Damping level | Q value | Musical effect |\n' +
        '|--------------|---------|----------------|\n' +
        '| Very low damping | Q > 500 | Long sustain — singing bowls, bells |\n' +
        '| Moderate damping | Q = 50–200 | Musical sustain — strings, flutes |\n' +
        '| High damping | Q < 20 | Quick decay — drums, percussion |\n' +
        '| Overdamped | Q < 1 | No oscillation — thud, no ring |',
      advancedContent:
        '**The driven damped oscillator (complete model):**\n\n' +
        '`m(d²x/dt²) + b(dx/dt) + kx = F₀cos(ωt)`\n\n' +
        'where b is the damping coefficient. The steady-state amplitude is:\n\n' +
        '`A = F₀ / √((k − mω²)² + (bω)²)`\n\n' +
        'Maximum at: ω_res = ω₀√(1 − 1/(2Q²)) ≈ ω₀ for high Q.\n\n' +
        '| Parameter | Effect on resonance curve |\n' +
        '|-----------|-------------------------|\n' +
        '| Increasing F₀ | Peak amplitude rises proportionally |\n' +
        '| Increasing b (damping) | Peak broadens AND lowers; Q drops |\n' +
        '| Increasing m | Shifts peak to lower frequency |\n' +
        '| Increasing k | Shifts peak to higher frequency |\n\n' +
        '**Energy considerations:** At resonance, the average power absorbed equals the power dissipated by damping: P = F₀²/(2b). The stored energy in the oscillator is Q times the energy input per cycle: E_stored = Q × E_input/cycle.\n\n' +
        '**The Tacoma Narrows Bridge (1940):** 65 km/h winds excited a torsional mode at ~0.2 Hz. The bridge\'s Q was high enough that over many cycles, the amplitude grew to ±14 degrees of twist before structural failure. This led to mandatory **aeroelastic flutter analysis** in all bridge and aircraft design.\n\n' +
        '| Engineering resonance disaster | Frequency match | Outcome |\n' +
        '|-------------------------------|----------------|---------|\n' +
        '| Tacoma Narrows Bridge (1940) | Wind ↔ torsional mode | Collapse after sustained oscillation |\n' +
        '| Millennium Bridge, London (2001) | Pedestrian footsteps ↔ lateral mode | Swaying; fixed with dampers |\n' +
        '| Mexico City earthquake (1985) | Seismic waves ↔ mid-rise building modes | Selective collapse of 8–15 storey buildings |\n\n' +
        '**Resonance in quantum mechanics:** The **Breit-Wigner scattering formula** describes resonance in particle physics:\n\n' +
        '`σ(E) ∝ Γ² / ((E − E₀)² + Γ²/4)`\n\n' +
        'Unstable particles (Z boson, Higgs) show resonance peaks in scattering cross-sections. The width Γ = ℏ/τ is inversely proportional to lifetime τ — a short-lived particle has a broad resonance, a long-lived one has a narrow peak.\n\n' +
        '**Musical acoustics:** Finite element analysis of instrument bodies reveals dozens of coupled resonance modes. A violin has interacting modes between top plate, back plate, air cavity, bridge, and strings — the legendary Stradivarius violins achieve their tone through wood density gradients that optimally couple these modes.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A bamboo flute sounds different from a metal flute because the tube material affects which resonant modes are emphasised.', answer: true, explanation: 'Bamboo dampens higher overtones due to its fibrous structure, while metal sustains them, producing a brighter sound.' },
            { text: 'The Tacoma Narrows Bridge collapsed because the wind was too strong.', answer: false, explanation: 'The wind speed (65 km/h) was moderate — the problem was that the wind frequency matched the bridge\'s natural torsional frequency, causing resonance that amplified vibrations until the structure failed.' },
            { text: 'A higher Q factor means a drum\'s sound will ring for longer after being struck.', answer: true, explanation: 'Q measures how long a resonance sustains. Higher Q means less energy lost per cycle, so vibrations ring longer. Drums have low Q (quick decay), while bells have high Q (long ring).' },
            { text: 'Resonance always amplifies vibrations — it can never reduce them.', answer: false, explanation: 'Anti-resonance (destructive interference at specific frequencies) can cancel vibrations. Active noise cancellation uses this principle: speakers emit sound at anti-phase to the noise, reducing amplitude to near zero.' },
          ],
        },
      },
    },

    // ── Section 5: How Instruments Make Sound ──────────────────────
    {
      title: 'How Instruments Make Sound',
      diagram: 'MusicalWavesDiagram',
      beginnerContent:
        'Musical instruments fall into families based on **what vibrates** to produce sound.\n\n' +
        '| Family | What vibrates | NE India instruments | Western examples |\n' +
        '|--------|--------------|---------------------|------------------|\n' +
        '| **Chordophone** (strings) | Stretched string | Dotara, ektara, sarod | Guitar, violin, sitar |\n' +
        '| **Aerophone** (wind) | Air column | Bamboo flute, pepa (buffalo horn) | Flute, trumpet, clarinet |\n' +
        '| **Membranophone** (drums) | Stretched membrane | Dhol, khol, nagara | Snare drum, tabla |\n' +
        '| **Idiophone** (self-vibrating) | Body of the instrument | Taal (cymbals), gogona (jaw harp) | Xylophone, triangle |\n\n' +
        '**The pepa of Assam — a physics lesson in bamboo and horn:**\n\n' +
        'The traditional pepa is made from a buffalo horn with a bamboo reed inserted at the narrow end. The musician buzzes their lips against the reed, making it vibrate. That tiny vibration alone is almost silent — but the flared horn **amplifies** it enormously, the same principle behind a modern saxophone or trumpet.\n\n' +
        '| Pepa component | Physics role | What it does |\n' +
        '|---------------|-------------|-------------|\n' +
        '| Bamboo reed | Vibration source | Creates the initial buzz (100–400 Hz) |\n' +
        '| Horn cavity | Resonator | Amplifies specific frequencies through resonance |\n' +
        '| Flared horn opening | Impedance matcher | Efficiently transfers sound energy to open air |\n\n' +
        '**Why bamboo sounds warm:** Bamboo\'s fibrous, porous structure dampens higher overtones (higher-frequency vibrations), giving bamboo instruments a mellow, warm quality. Metal instruments vibrate at many frequencies simultaneously, producing a brighter, more cutting sound.\n\n' +
        '**The gogona (Assamese jaw harp):** This tiny bamboo instrument is held against the teeth while a reed is plucked. The mouth cavity acts as a variable resonator — by changing the shape of your mouth, you amplify different overtones of the same fundamental vibration, producing melody from a single vibrating reed.',
      intermediateContent:
        '**String physics — the harmonics recipe:**\n\n' +
        '`f = (1/2L) × √(T/μ)` gives the fundamental; harmonics at 2f, 3f, 4f...\n\n' +
        '**Worked example — Sitar string:**\n' +
        'L = 0.9 m, T = 50 N, μ = 0.0005 kg/m\n' +
        'f = (1/1.8) × √(100,000) = 0.556 × 316.2 = **175.7 Hz** (roughly F3)\n' +
        'Harmonics: 351 Hz, 527 Hz, 703 Hz, 878 Hz...\n\n' +
        '**The harmonic series and musical intervals:**\n\n' +
        '| Harmonic | Frequency ratio | Musical interval | How it sounds |\n' +
        '|----------|----------------|-----------------|---------------|\n' +
        '| 1st (fundamental) | 1:1 | Unison | The basic note |\n' +
        '| 2nd | 2:1 | Octave | Same note, higher |\n' +
        '| 3rd | 3:2 (vs 2nd) | Perfect fifth | Strong, open, "complete" |\n' +
        '| 4th | 4:3 (vs 3rd) | Perfect fourth | Stable, hymn-like |\n' +
        '| 5th | 5:4 (vs 4th) | Major third | Bright, happy |\n' +
        '| 6th | 6:5 (vs 5th) | Minor third | Darker, melancholic |\n' +
        '| 7th | 7:4 (vs 4th) | Harmonic seventh | Bluesy, flat |\n\n' +
        '**Timbre — the colour of sound:**\n\n' +
        'Each instrument emphasises different harmonics — this is why a flute and a guitar playing the same note sound completely different.\n\n' +
        '| Instrument | Harmonic recipe | Resulting timbre |\n' +
        '|-----------|----------------|------------------|\n' +
        '| Clarinet (closed pipe) | Odd harmonics only (1, 3, 5, 7...) | Hollow, woody |\n' +
        '| Flute (open pipe) | All harmonics, rapidly decreasing | Pure, breathy |\n' +
        '| Bamboo flute | All harmonics, mid-range emphasis | Warm, mellow |\n' +
        '| Violin | All harmonics, complex bowing effects | Rich, singing |\n' +
        '| Dhol | Inharmonic (Bessel function modes) | Noisy, percussive |\n\n' +
        '**Drum physics — 2D vibration modes:** A circular drumhead (like a dhol\'s cowhide) vibrates in 2D patterns described by **Bessel functions** J_mn. Unlike strings, the overtones are NOT integer multiples of the fundamental:\n\n' +
        '| Mode | Frequency ratio (to fundamental) | Pattern |\n' +
        '|------|----------------------------------|--------|\n' +
        '| (0,1) | 1.000 | Whole head moves up and down |\n' +
        '| (1,1) | 1.593 | Head splits into two halves |\n' +
        '| (2,1) | 2.136 | Four quadrants alternate |\n' +
        '| (0,2) | 2.296 | Ring pattern — edge vs centre |\n\n' +
        'These inharmonic frequencies (not neat integer ratios) give drums their characteristic "noisy," percussive quality — and why they don\'t produce a clear, singable pitch like a flute.',
      advancedContent:
        '**Fourier\'s theorem — decomposing any sound:**\n\n' +
        'Any periodic waveform can be decomposed into a sum of sine waves:\n\n' +
        '`f(t) = a₀/2 + Σ[aₙcos(nωt) + bₙsin(nωt)]`\n\n' +
        'The coefficients aₙ, bₙ define the **spectrum** — the unique recipe of harmonics that gives each instrument its voice.\n\n' +
        '| Analysis method | Formula / approach | Time complexity | Use case |\n' +
        '|----------------|-------------------|----------------|----------|\n' +
        '| Fourier Series | Analytical: aₙ = (2/T)∫f(t)cos(nωt)dt | — | Periodic signals |\n' +
        '| DFT (Discrete Fourier Transform) | X[k] = Σ x[n]e^(-j2πkn/N) | O(N²) | Digital signals |\n' +
        '| FFT (Cooley-Tukey, 1965) | Divide-and-conquer DFT | O(N log N) | Real-time spectrum analysis |\n' +
        '| STFT (Short-Time FT) | FFTs over sliding windows | O(N log N per window) | Spectrograms — time + frequency |\n' +
        '| Wavelet Transform | Variable-width windows | O(N) | Non-stationary signals |\n\n' +
        '**The Gabor limit (uncertainty principle for signals):**\n\n' +
        '`Δt × Δf ≥ 1/(4π)`\n\n' +
        'You cannot have perfect time AND frequency resolution simultaneously:\n\n' +
        '| Window width | Time resolution | Frequency resolution | Best for |\n' +
        '|-------------|----------------|---------------------|----------|\n' +
        '| Narrow (5 ms) | Excellent | Poor | Transients, clicks, drum attacks |\n' +
        '| Medium (50 ms) | Good | Good | Speech, most instruments |\n' +
        '| Wide (500 ms) | Poor | Excellent | Low bass notes, sustained tones |\n\n' +
        '**Wavelet analysis** resolves this by using variable-width windows — narrow at high frequencies (good time resolution) and wide at low frequencies (good frequency resolution), matching how human hearing naturally works.\n\n' +
        '**Physical modelling synthesis** (used in modern digital instruments) solves the actual wave equations for strings, tubes, and membranes in real time, producing sounds indistinguishable from real instruments:\n\n' +
        '| Model component | Equation | What it captures |\n' +
        '|----------------|----------|------------------|\n' +
        '| Ideal string | ∂²y/∂t² = (T/μ)∂²y/∂x² | Basic pitch and harmonics |\n' +
        '| Stiff string | Add +EI∂⁴y/∂x⁴ term | Inharmonicity (piano strings) |\n' +
        '| Damped string | Add −2b∂y/∂t term | Natural decay |\n' +
        '| Body resonance | Coupled oscillator | Timbre, projection |',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each NE India instrument to its acoustic family and vibration source',
          pairs: [
            ['Dhol (Bihu drum)', 'Membranophone — stretched cowhide membrane vibrates when struck'],
            ['Pepa (buffalo horn)', 'Aerophone — bamboo reed vibrates, horn cavity amplifies'],
            ['Dotara (two-string lute)', 'Chordophone — plucked strings vibrate, wooden body resonates'],
            ['Gogona (jaw harp)', 'Idiophone — bamboo reed vibrates, mouth cavity shapes tone'],
          ],
        },
      },
    },

    // ── Section 6: The Speed of Sound ──────────────────────────────
    {
      title: 'The Speed of Sound',
      beginnerContent:
        'Sound travels at different speeds depending on what it travels through. In air at room temperature, sound moves at about **343 metres per second** — roughly **1,235 km/h**. That sounds fast, but light travels nearly a million times faster, which is why you see lightning before you hear thunder.\n\n' +
        '**Analogy — passing a message through a crowd:** Imagine people standing shoulder to shoulder. If you push the first person, the push travels quickly because they\'re close together — that\'s like sound in a **solid**. Now imagine people standing far apart — each person must walk to the next to pass the message — that\'s like sound in a **gas** (slower).\n\n' +
        '| Medium | Speed of sound | Times faster than air | Why |\n' +
        '|--------|---------------|----------------------|-----|\n' +
        '| Air (20°C) | 343 m/s | 1× (reference) | Gas molecules far apart |\n' +
        '| Air (35°C, Assam summer) | 352 m/s | 1.03× | Warmer = faster molecules |\n' +
        '| Water | 1,480 m/s | 4.3× | Liquid molecules closer together |\n' +
        '| Brahmaputra river water | ~1,500 m/s | 4.4× | Slightly faster due to sediment |\n' +
        '| Bamboo (along grain) | ~3,300 m/s | 9.6× | Stiff fibres transmit vibrations well |\n' +
        '| Steel | 5,960 m/s | 17.4× | Tightly bonded atoms — fastest common solid |\n' +
        '| Diamond | 12,000 m/s | 35× | Extremely stiff crystal lattice |\n' +
        '| Vacuum (space) | 0 m/s | — | No molecules at all |\n\n' +
        '**Temperature effects — hear a train on a cold night:**\n\n' +
        'On a cold night, the air near the ground is cooler than the air above. Since sound travels slower in cool air, sound waves bend (refract) **downward**, staying close to the ground instead of spreading upward. This is why you can hear a distant train, a temple bell, or even a conversation across a still river more clearly on a cold Assam winter night.\n\n' +
        '| Condition | What happens to sound | Effect |\n' +
        '|-----------|---------------------|--------|\n' +
        '| Cool ground, warm air above (night) | Sound bends downward | Carries farther — distant sounds clearer |\n' +
        '| Hot ground, cool air above (day) | Sound bends upward | Escapes skyward — distant sounds fainter |\n' +
        '| Wind blowing toward you | Sound pushed toward you | Source sounds closer |\n' +
        '| Wind blowing away from you | Sound pushed away | Source sounds farther |',
      intermediateContent:
        '**Speed of sound in a gas — the full formula:**\n\n' +
        '`v = √(γRT/M)`\n\n' +
        'where γ = ratio of specific heats, R = 8.314 J/(mol·K), T = temperature in Kelvin, M = molar mass (kg/mol).\n\n' +
        '**Worked example 1 — Air at 20°C (293 K):**\n' +
        'γ = 1.4 (diatomic), M = 0.029 kg/mol\n' +
        'v = √(1.4 × 8.314 × 293 / 0.029) = √(118,168) = **343.8 m/s** ✓\n\n' +
        '**Worked example 2 — Helium at 20°C:**\n' +
        'γ = 1.67 (monatomic), M = 0.004 kg/mol\n' +
        'v = √(1.67 × 8.314 × 293 / 0.004) = √(1,015,574) = **1,008 m/s**\n\n' +
        'Nearly 3× faster than air! This is why helium makes your voice squeaky — higher speed → higher resonant frequencies in your vocal tract.\n\n' +
        '**Speed in liquids and solids — Newton-Laplace equation:**\n\n' +
        '`v = √(K/ρ)` (K = bulk modulus, ρ = density)\n\n' +
        '| Medium | K (Pa) | ρ (kg/m³) | v = √(K/ρ) |\n' +
        '|--------|--------|-----------|------------|\n' +
        '| Water | 2.2 × 10⁹ | 1,000 | **1,483 m/s** |\n' +
        '| Steel | 160 × 10⁹ | 7,800 | **4,529 m/s** (longitudinal) |\n' +
        '| Rubber | 1.5 × 10⁹ | 1,100 | **1,168 m/s** |\n' +
        '| Bone | 15 × 10⁹ | 1,900 | **2,810 m/s** |\n\n' +
        '**Temperature refraction — quantitative:**\n\n' +
        'Sound bends toward the region of lower speed (cooler air). The refraction follows **Snell\'s law for sound**:\n\n' +
        '`sin θ₁ / v₁ = sin θ₂ / v₂`\n\n' +
        '**Worked example 3 — Cold night refraction:**\n' +
        'Ground air at 5°C (v₁ = 334 m/s), air at 10 m height at 15°C (v₂ = 340 m/s).\n' +
        'A sound ray at 80° from vertical: sin(80°)/334 = sin(θ₂)/340\n' +
        'sin(θ₂) = 0.9848 × 340/334 = 1.003 → **total internal reflection!** The sound ray bends back down and never escapes upward. This trapping effect is why sounds carry extraordinarily far on cold, still nights.',
      advancedContent:
        '**Anisotropic media — speed depends on direction:**\n\n' +
        'In crystals and wood, the **Christoffel equation** determines directional sound speed:\n\n' +
        '`(C_ijkl × n_j × n_l − ρv²δ_ik) × p_k = 0`\n\n' +
        'where C is the stiffness tensor (up to 21 independent components). This is why a spruce violin top has different sound speeds along and across the grain:\n\n' +
        '| Direction in spruce | Speed (m/s) | Ratio |\n' +
        '|--------------------|------------|-------|\n' +
        '| Along grain (longitudinal) | 5,600 | 1.00 |\n' +
        '| Across grain (radial) | 1,400 | 0.25 |\n' +
        '| Across grain (tangential) | 1,000 | 0.18 |\n\n' +
        'Instrument makers intuitively exploit this anisotropy — they tap wood and listen for the "tap tone" to select pieces with optimal grain orientation. The same principle applies to bamboo used in traditional instruments.\n\n' +
        '**Dispersive vs non-dispersive media:**\n\n' +
        '| Medium | Dispersive? | Consequence |\n' +
        '|--------|------------|------------|\n' +
        '| Air (audible range) | No | All frequencies travel at same speed — waveform preserved |\n' +
        '| Deep ocean (for low-frequency sound) | Yes | SOFAR channel: low-frequency whale calls travel thousands of km |\n' +
        '| Stiff string (piano) | Slightly | Higher harmonics slightly sharp → "inharmonicity" |\n' +
        '| Earth (seismic waves) | Strongly | P-waves and S-waves separate with distance |\n\n' +
        '**Acoustic metamaterials** — engineering artificial media with impossible properties:\n\n' +
        '| Metamaterial type | Property | Application |\n' +
        '|------------------|----------|------------|\n' +
        '| Negative bulk modulus | Sound bends backward (negative refraction) | Acoustic superlensing |\n' +
        '| Bandgap structures | Certain frequencies cannot propagate | Sound barriers without mass |\n' +
        '| Acoustic cloak (Duke, 2014) | Sound guided around an object | Making objects acoustically invisible |\n' +
        '| Topological insulators | Sound travels along edges, immune to defects | Robust waveguides |\n\n' +
        '**Phonons** — the quantum of sound: In solid-state physics, sound is quantised into phonons (E = ℏω, p = ℏk). Phonon statistics (Bose-Einstein) underpin the **Debye model** of specific heat, explaining why C_v ∝ T³ at low temperatures. At the Debye temperature T_D (e.g., 428 K for aluminium), all phonon modes are excited and C_v plateaus at 3Nk_B (Dulong-Petit law).',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each medium to the speed of sound through it',
          pairs: [
            ['Air (20°C)', '343 m/s — baseline for everyday acoustics'],
            ['Water', '1,480 m/s — 4× faster; Gangetic dolphins use this for sonar'],
            ['Steel', '5,960 m/s — 17× faster; tightly bonded atoms transmit vibrations rapidly'],
            ['Vacuum (outer space)', 'Sound cannot travel — no molecules to vibrate'],
          ],
        },
      },
    },

    // ── Section 7: Echoes, Doppler Effect & Sonic Booms ────────────
    {
      title: 'Echoes, Doppler Effect & Sonic Booms',
      diagram: 'DopplerEffectDiagram',
      beginnerContent:
        'Sound waves bounce off hard surfaces just like a ball bounces off a wall. When the reflected sound reaches your ears with enough delay, you hear an **echo**.\n\n' +
        '**Echoes in the hills of NE India:** Shout across a valley in Meghalaya or towards the Naga Hills, and your voice bounces off the distant cliff face and returns to you. The hills must be at least **17 metres** away for your brain to distinguish the echo from the original sound — closer than that, and the reflection merges with your voice (creating **reverberation** instead of a distinct echo).\n\n' +
        '| Reflection effect | Minimum distance | What you hear | Example |\n' +
        '|-------------------|-----------------|---------------|------------------|\n' +
        '| **No reflection** | Outdoors, no walls | Clean, direct sound | Open Brahmaputra riverbank |\n' +
        '| **Reverberation** | < 17 m | Blurred, lingering sound | Inside a Kamakhya temple corridor |\n' +
        '| **Distinct echo** | > 17 m | Clear repeat of your voice | Shouting across a Meghalaya valley |\n' +
        '| **Multiple echoes** | Multiple reflectors | Repeating, fading copies | Between two cliff faces in the Naga Hills |\n\n' +
        '**The Doppler Effect — why sirens change pitch:**\n\n' +
        'When an ambulance speeds toward you, it "catches up" to its own sound waves, squeezing them closer together → shorter wavelength → higher frequency → **higher pitch**. As it drives away, it stretches the waves apart → longer wavelength → lower frequency → **lower pitch**.\n\n' +
        '| Situation | What happens to pitch | Why |\n' +
        '|-----------|---------------------|-----|\n' +
        '| Source approaching you | Pitch rises | Waves compressed ahead of source |\n' +
        '| Source stationary | Normal pitch | Waves spread evenly in all directions |\n' +
        '| Source moving away | Pitch drops | Waves stretched behind source |\n' +
        '| You approaching source | Pitch rises | You encounter wave crests more often |\n' +
        '| You moving away from source | Pitch drops | You encounter wave crests less often |\n\n' +
        '**Sonic booms:** When an aircraft exceeds the speed of sound, it outruns its own sound waves, which pile up into a **shock wave** — a cone of intense pressure you hear as a sharp thunderclap. Contrary to popular belief, the boom is not a one-time event at the "barrier" — the cone follows the aircraft continuously.',
      intermediateContent:
        '**The Doppler Effect formula:**\n\n' +
        '`f_observed = f_source × (v ± v_observer) / (v ∓ v_source)`\n\n' +
        '(Use + in numerator when observer moves toward source; + in denominator when source moves away.)\n\n' +
        '**Worked example 1 — Ambulance approaching:**\n' +
        'f_source = 700 Hz, v_source = 30 m/s (approaching), v = 343 m/s\n' +
        'f = 700 × 343 / (343 − 30) = 700 × 343/313 = **767 Hz** (noticeably higher)\n\n' +
        '**Worked example 2 — Same ambulance receding:**\n' +
        'f = 700 × 343 / (343 + 30) = 700 × 343/373 = **644 Hz** (noticeably lower)\n\n' +
        'The pitch shift: 767 − 644 = **123 Hz** — nearly a musical fourth!\n\n' +
        '**Worked example 3 — Echo distance calculation:**\n' +
        'You shout towards a cliff and hear the echo 0.5 seconds later.\n' +
        'd = (v × t) / 2 = (343 × 0.5) / 2 = **85.75 m** (divide by 2 because sound travels there AND back)\n\n' +
        '| Measurement | Formula | Variable |\n' +
        '|-------------|---------|----------|\n' +
        '| Echo distance | d = vt/2 | t = round-trip time |\n' +
        '| Minimum echo distance | d_min = v × 0.1 / 2 = **17.15 m** | Brain needs ~0.1 s to separate sounds |\n' +
        '| Doppler shift (approaching) | f\' = f × v/(v − v_s) | v_s = source speed |\n' +
        '| Doppler shift (receding) | f\' = f × v/(v + v_s) | v_s = source speed |\n' +
        '| Mach number | M = v_object / v_sound | M = 1 → speed of sound |\n\n' +
        '**Worked example 4 — Sonar in the Brahmaputra:**\n' +
        'A Gangetic dolphin emits a 100 kHz click. It reflects off a fish 5 m away.\n' +
        'In water (v = 1,480 m/s): round-trip time = 2 × 5 / 1,480 = **6.76 ms**\n' +
        'The dolphin\'s brain processes this delay to "see" the fish in murky water.\n\n' +
        '| Sonar application | Medium | Speed used |\n' +
        '|-------------------|--------|------------|\n' +
        '| Gangetic dolphin echolocation | River water | 1,500 m/s |\n' +
        '| Bat hunting in Manas forest | Air | 343 m/s |\n' +
        '| Ship depth sounder on Brahmaputra | River water | 1,500 m/s |\n' +
        '| Medical ultrasound | Body tissue | ~1,540 m/s |',
      advancedContent:
        '**The Mach cone:**\n\n' +
        'When v_source > v_sound, the shock wave forms a cone with half-angle:\n\n' +
        '`sin θ = 1/M` (where M = Mach number)\n\n' +
        '| Mach number | Speed (at sea level) | Cone half-angle | Example |\n' +
        '|------------|---------------------|----------------|----------|\n' +
        '| M = 1.0 | 1,235 km/h | 90° (flat) | Just breaking the barrier |\n' +
        '| M = 1.5 | 1,853 km/h | 41.8° | Fighter jet cruise |\n' +
        '| M = 2.0 | 2,470 km/h | 30.0° | Concorde cruise speed |\n' +
        '| M = 3.0 | 3,705 km/h | 19.5° | SR-71 Blackbird |\n' +
        '| M = 25 | ~30,000 km/h | 2.3° | Space shuttle re-entry |\n\n' +
        '**Rankine-Hugoniot conditions** describe the pressure jump across a shock front:\n\n' +
        '`p₂/p₁ = (2γM² − γ + 1) / (γ + 1)`\n\n' +
        'At Mach 2 in air (γ = 1.4):\n' +
        'p₂/p₁ = (2 × 1.4 × 4 − 0.4) / 2.4 = (11.2 − 0.4) / 2.4 = **4.5× atmospheric pressure** — enough to rattle windows and startle livestock.\n\n' +
        '| Property | Across the shock (M = 2) |\n' +
        '|----------|-------------------------|\n' +
        '| Pressure ratio p₂/p₁ | 4.50 |\n' +
        '| Density ratio ρ₂/ρ₁ | 2.67 |\n' +
        '| Temperature ratio T₂/T₁ | 1.69 |\n' +
        '| Mach number behind shock | 0.577 (subsonic!) |\n\n' +
        '**Relativistic Doppler effect (for light):**\n\n' +
        '`f_obs = f_source × √((1 − β)/(1 + β))` where β = v/c\n\n' +
        'Unlike sound, light\'s Doppler formula is symmetric (no preferred frame) and includes a **transverse Doppler effect** absent in classical acoustics — even a source moving perpendicular to the observer shows a redshift due to time dilation.\n\n' +
        '| Doppler type | Formula | Physical basis |\n' +
        '|-------------|---------|----------------|\n' +
        '| Classical (sound) | f\' = f(v ± v_o)/(v ∓ v_s) | Wave compression in medium |\n' +
        '| Relativistic (light) | f\' = f√((1−β)/(1+β)) | No medium; time dilation |\n' +
        '| Cosmological redshift | z = Δλ/λ₀ | Space itself expanding |\n\n' +
        'The **cosmological redshift** of distant galaxies (z > 0) provided key evidence for the expanding universe. The most distant observed galaxies have z ≈ 13, meaning their light has been stretched by a factor of 14 since emission — ultraviolet light redshifted to infrared.\n\n' +
        '**Gravitational waves** also exhibit Doppler-like frequency shifts as their sources (merging black holes, neutron stars) move relative to LIGO/Virgo detectors.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A sonic boom occurs only at the instant an aircraft "breaks the sound barrier."', answer: false, explanation: 'The shock wave is a continuous cone that follows the aircraft as long as it flies supersonic. Ground observers hear the boom as the cone sweeps past them.' },
            { text: 'You need a reflecting surface at least 17 metres away to hear a distinct echo.', answer: true, explanation: 'Sound takes about 0.1 seconds to travel 34 m round trip (17 m each way). The human brain needs ~0.1 s to distinguish the echo from the original sound.' },
            { text: 'The Doppler effect changes the actual frequency the source produces.', answer: false, explanation: 'The source\'s frequency is unchanged. Only the observed frequency changes due to the relative motion between source and observer compressing or stretching the waves.' },
            { text: 'Gangetic river dolphins in the Brahmaputra use sound (sonar) because the water is too muddy to see through.', answer: true, explanation: 'Gangetic dolphins are nearly blind and rely on echolocation — emitting ultrasonic clicks and listening for reflections — to navigate and hunt in the silt-laden Brahmaputra.' },
          ],
        },
      },
    },
  ],
};
