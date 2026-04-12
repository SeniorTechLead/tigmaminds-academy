import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'sound-and-vibration',
  title: 'Sound & Vibration',
  category: 'physics',
  icon: '🔊',
  tagline: 'How vibrations become music, speech, and the roar of a river.',
  relatedStories: ['bamboo-taught-wind', 'bamboo-flute-of-nagaland', 'dhol-drum', 'music-dimasa', 'frogs-sing-rain', 'mountain-echoes'],
  understand: [
    {
      title: 'What Is Sound?',
      beginnerContent:
        'Sound is a vibration that travels through a medium — air, water, wood, metal, or even the ground. When you pluck a guitar string, it vibrates back and forth hundreds of times per second. Each vibration pushes the air molecules next to the string, which push the molecules next to them, creating a chain reaction of compressions (molecules pushed close together) and rarefactions (molecules spread apart). This chain of compressions and rarefactions is a sound wave. Unlike light, sound cannot travel through a vacuum — there are no molecules to push. That is why there is no sound in outer space, no matter how dramatic the movie explosion looks.',
      intermediateContent:
        'The **wave equation** for sound is: **v = fλ**, where v is speed (343 m/s in air at 20°C), f is frequency (Hz), and λ is wavelength (m). For a 440 Hz note: λ = 343/440 = **0.78 m**. For a 20 Hz bass rumble: λ = 343/20 = **17.15 m** — over 17 metres long! The speed of sound in air depends on temperature: **v = 331 + 0.6T** (where T is in °C). At 0°C: v = 331 m/s. At 35°C (hot Assam summer): v = 331 + 21 = **352 m/s**. Sound intensity follows the **inverse square law**: **I = P/(4πr²)**. Double your distance from a source and intensity drops to 1/4. A speaker emitting 1 W at 1 m: I = 1/(4π×1) = **0.08 W/m²**. At 10 m: I = **0.0008 W/m²**.',
      advancedContent:
        'The **wave equation** in 3D is **∂²p/∂t² = c²∇²p**, where p is pressure variation and c is sound speed. Solutions include plane waves (p = A sin(kx − ωt)), spherical waves (p = (A/r) sin(kr − ωt)), and standing waves. The speed of sound in a gas derives from thermodynamics: **c = √(γRT/M)**, where γ is the adiabatic index (1.4 for diatomic air), R = 8.314 J/(mol·K), T is absolute temperature, and M is molar mass. This explains why helium (M = 4 g/mol) carries sound at ~1,007 m/s vs nitrogen (M = 28 g/mol) at ~349 m/s — lighter molecules transmit vibrations faster, which is why helium makes your voice squeaky (higher resonant frequencies in your vocal tract). In **nonlinear acoustics**, high-amplitude waves steepen into shock waves because the speed of sound increases with pressure: the crests travel faster than the troughs, creating the N-wave profile of a sonic boom.',
      diagram: 'TransverseLongitudinalDiagram',
    },
    {
      title: 'Frequency and Pitch',
      beginnerContent:
        'Frequency is the number of complete vibrations (cycles) per second, measured in Hertz (Hz). A tuning fork vibrating 440 times per second produces the note A above middle C — we say it has a frequency of 440 Hz. Higher frequency means higher pitch. A piccolo plays notes above 2,000 Hz; a bass drum rumbles below 100 Hz. Humans can hear frequencies roughly between 20 Hz and 20,000 Hz, though the upper limit drops as you age. Dogs can hear up to about 65,000 Hz, and bats can detect sounds above 100,000 Hz — frequencies we call ultrasound. The bamboo flutes of Nagaland produce their haunting tones because the length and diameter of the bamboo tube determine which frequencies resonate inside it.',
      intermediateContent:
        'For a vibrating string, the fundamental frequency is **f = (1/2L) × √(T/μ)**, where L is length, T is tension (N), and μ is mass per unit length (kg/m). A guitar string: L = 0.65 m, T = 70 N, μ = 0.001 kg/m. f = (1/1.3) × √(70/0.001) = 0.769 × 264.6 = **203.5 Hz** (roughly G3). Halve the string length (press at the 12th fret): f doubles to **407 Hz** — one octave higher. For an open pipe (like a flute): **f_n = nv/(2L)**, where n = 1, 2, 3... (all harmonics). For a closed pipe (one end sealed): **f_n = nv/(4L)**, n = 1, 3, 5... (odd harmonics only). A 30 cm bamboo flute (open): f₁ = 343/(2×0.30) = **572 Hz** (approximately D5).',
      advancedContent:
        'The human perception of pitch is not strictly linear with frequency — it follows a roughly **logarithmic** scale. The **mel scale** (Stevens, 1937) quantifies perceived pitch: mel = 2595 × log₁₀(1 + f/700). Doubling the frequency (one octave) does not double the mel value above ~1 kHz. The **place theory** of hearing (Helmholtz/Bekesy) explains that different frequencies excite different positions along the basilar membrane in the cochlea: high frequencies near the base (stiff, narrow), low frequencies near the apex (flexible, wide). The basilar membrane acts as a **Fourier analyzer**, decomposing complex sounds into frequency components. Modern cochlear implants exploit this by stimulating electrodes at different positions to create pitch perception. **Otoacoustic emissions** — sounds generated by the cochlea itself — prove that hearing is an active process: outer hair cells amplify weak signals by ~40 dB through electromotility (changing length in response to voltage), a piezoelectric-like effect unique to mammalian hearing.',
      diagram: 'SineWaveDiagram',
    },
    {
      title: 'Amplitude and Volume',
      beginnerContent:
        'While frequency determines pitch, amplitude determines volume (loudness). Amplitude is the height of the sound wave — how far the molecules are pushed from their resting position. A louder sound has larger amplitude, meaning the compressions are more compressed and the rarefactions are more rarefied. Volume is measured in decibels (dB). A whisper is about 30 dB, normal conversation about 60 dB, a lawn mower about 90 dB, and a rock concert can exceed 110 dB. The decibel scale is logarithmic: every increase of 10 dB means the sound is ten times more intense. Prolonged exposure to sounds above 85 dB can cause permanent hearing damage.',
      intermediateContent:
        'The decibel formula is **dB = 10 × log₁₀(I/I₀)**, where I₀ = 10⁻¹² W/m² (the threshold of hearing). Normal conversation at I = 10⁻⁶ W/m²: dB = 10 × log₁₀(10⁻⁶/10⁻¹²) = 10 × log₁₀(10⁶) = **60 dB**. Adding two identical sources: total intensity doubles, so ΔdB = 10 × log₁₀(2) = **+3 dB** (not double!). Ten identical sources: +10 dB. The **sound pressure level** uses the formula **dB_SPL = 20 × log₁₀(p/p₀)**, where p₀ = 20 μPa. Note the factor of 20 (not 10) because intensity is proportional to pressure squared. A sound at 1 Pa pressure: dB_SPL = 20 × log₁₀(1/0.00002) = 20 × log₁₀(50,000) = 20 × 4.7 = **94 dB**.',
      advancedContent:
        'Human loudness perception is described by the **Fletcher-Munson curves** (equal-loudness contours, ISO 226). At low volumes, we are far more sensitive to mid-frequencies (~2-5 kHz, where speech consonants live) than to bass or treble. At 40 dB SPL, a 100 Hz tone must be boosted to ~60 dB to sound as loud as a 1 kHz tone. This is why music sounds "thin" at low volumes — bass perception drops disproportionately. The **phon** scale accounts for this: 1 phon = 1 dB SPL at 1 kHz, with other frequencies adjusted to equal perceived loudness. The **sone** scale is truly linear: 1 sone = 40 phons, and doubling sones doubles perceived loudness. **Acoustic impedance** Z = ρc (density × speed) determines how much sound transmits between media: at an air-water interface, Z_air = 415 Pa·s/m vs Z_water = 1.48×10⁶ Pa·s/m, so **99.9% of sound energy reflects** — which is why underwater sounds are muffled from above.',
      interactive: {
        type: 'slider',
        props: {},
      },
    },
    {
      title: 'Resonance — When Vibrations Amplify',
      beginnerContent:
        'Every object has a natural frequency at which it "wants" to vibrate — push a child on a swing at the right rhythm and each push adds energy. This is resonance. When an external vibration matches an object\'s natural frequency, the vibrations build on each other and the amplitude grows dramatically. This is why an opera singer can shatter a wine glass: they sustain a note at the glass\'s natural frequency until the vibrations exceed what the glass can withstand. Resonance is also why a bamboo flute produces a clear, strong tone. The column of air inside the flute resonates at specific frequencies determined by the tube\'s length and the positions of the finger holes. Open a hole, and you change the effective length, changing the resonant frequency, changing the note.',
      intermediateContent:
        'The resonant frequency of a spring-mass system is **f₀ = (1/2π) × √(k/m)**, where k is stiffness and m is mass. A 0.1 kg glass with k = 40,000 N/m: f₀ = (1/2π) × √(400,000) = **100.7 Hz**. The **quality factor** Q = f₀/Δf measures how sharp the resonance is — a wine glass has Q ≈ 1,000, meaning its resonance peak is very narrow and energy builds up enormously. After n cycles at resonance, amplitude grows roughly as n/Q of the driving amplitude. For a standing wave in an open tube: resonant wavelengths are **λ_n = 2L/n** (n = 1, 2, 3...). In a 0.6 m flute: λ₁ = 1.2 m, f₁ = 343/1.2 = **286 Hz** (roughly D4). The harmonics f₂ = 572 Hz, f₃ = 858 Hz, etc., are what give the flute its timbre.',
      advancedContent:
        'Resonance is modeled as a **driven damped oscillator**: m(d²x/dt²) + b(dx/dt) + kx = F₀cos(ωt), where b is the damping coefficient. The steady-state amplitude is **A = F₀/√((k−mω²)² + (bω)²)**, maximum when ω = ω₀√(1 − 1/(2Q²)) ≈ ω₀ for high Q. The **Tacoma Narrows Bridge** (1940) famously collapsed from resonance — 65 km/h winds matched one of the bridge\'s torsional modes. This led to the field of **aeroelastic flutter** analysis, now mandatory in all bridge and aircraft design. In quantum mechanics, resonance appears in **Breit-Wigner scattering**: unstable particles (like the Z boson) have a resonance peak in the scattering cross-section, with width Γ = ℏ/τ inversely proportional to lifetime τ. Musical acoustics researchers use **finite element analysis** to model the resonant modes of instrument bodies — a violin has dozens of coupled resonance modes between the top plate, back plate, air cavity, and strings.',
      diagram: 'ResonanceDiagram',
    },
    {
      title: 'How Instruments Make Sound',
      beginnerContent:
        'Musical instruments fall into families based on what vibrates. In string instruments (guitar, violin, sarod), a stretched string vibrates and transfers energy to a resonating body. In wind instruments (flute, trumpet, pepa), a column of air vibrates inside a tube. In percussion instruments (drum, dhol, xylophone), a membrane or solid surface vibrates when struck. The material matters enormously: bamboo produces a warm, mellow tone because its fibrous structure dampens higher overtones, while metal produces a brighter sound because it vibrates at many frequencies simultaneously. The traditional pepa of Assam — made from a buffalo horn with a bamboo reed — combines a vibrating reed (the buzzing source) with a flared horn (the amplifier), the same principle behind a modern saxophone.',
      intermediateContent:
        'String frequency: **f = (1/2L)√(T/μ)**. A sitar string with L = 0.9 m, T = 50 N, μ = 0.0005 kg/m: f = (1/1.8)√(100,000) = 0.556 × 316.2 = **175.7 Hz** (roughly F3). Harmonics occur at 2f, 3f, 4f... The **harmonic series** (f, 2f, 3f, 4f, 5f) corresponds to musical intervals: octave, fifth, fourth, major third. Each instrument emphasizes different harmonics — this is **timbre**. A Fourier analysis of a clarinet shows **odd harmonics only** (1st, 3rd, 5th...) because it behaves as a closed pipe. A flute shows **all harmonics** but with rapidly decreasing amplitude. A dhol drum head vibrates in 2D modes described by **Bessel functions** J_mn — these produce inharmonic frequencies (not integer multiples), giving drums their characteristic "noisy" quality.',
      advancedContent:
        '**Fourier\'s theorem** states that any periodic waveform can be decomposed into a sum of sine waves: f(t) = a₀/2 + Σ[aₙcos(nωt) + bₙsin(nωt)]. The coefficients aₙ, bₙ define the **spectrum** — the recipe of harmonics. The **Fast Fourier Transform** (FFT, Cooley-Tukey 1965) computes this in O(N log N) time, enabling real-time spectrum analysis on phones. For non-periodic sounds (transients, speech), the **Short-Time Fourier Transform** (STFT) computes FFTs over sliding windows to produce a **spectrogram** — a time-frequency-intensity map. The **Gabor limit** (uncertainty principle for signals): Δt × Δf ≥ 1/(4π) means you cannot have perfect time AND frequency resolution simultaneously — narrow time windows give poor frequency resolution and vice versa. **Wavelet analysis** addresses this by using variable-width windows, achieving better time resolution at high frequencies and better frequency resolution at low frequencies — matching how human hearing works.',
      diagram: 'MusicalWavesDiagram',
    },
    {
      title: 'The Speed of Sound',
      beginnerContent:
        'Sound travels at different speeds depending on the medium. In air at room temperature, sound moves at about 343 metres per second — roughly 1,235 km/h. In water, it travels about 1,480 m/s, more than four times faster. In steel, it reaches about 5,960 m/s. The pattern: sound travels fastest through solids, slower through liquids, and slowest through gases. This is because molecules in a solid are packed tightly and pass vibrations to their neighbors quickly. Temperature also matters — warmer air carries sound faster because the molecules move more energetically. This is why you can sometimes hear a distant train more clearly on a cold night: the cool air near the ground refracts sound waves downward, trapping them close to the surface.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each medium to the speed of sound through it',
          pairs: [
            ['Air (20 degrees C)', '343 m/s'],
            ['Water', '1,480 m/s'],
            ['Steel', '5,960 m/s'],
            ['Vacuum (outer space)', 'Sound cannot travel — no molecules to vibrate'],
          ],
        },
      },
      intermediateContent:
        'The speed of sound in a gas is **v = √(γRT/M)**, where γ = ratio of specific heats (1.4 for air), R = 8.314 J/(mol·K), T = temperature in Kelvin, M = molar mass (0.029 kg/mol for air). At 20°C (293 K): v = √(1.4 × 8.314 × 293 / 0.029) = √(118,168) = **343.8 m/s**. In water, sound speed uses the **Newton-Laplace equation**: **v = √(K/ρ)**, where K is bulk modulus (2.2 × 10⁹ Pa for water) and ρ is density (1,000 kg/m³): v = √(2.2×10⁶) = **1,483 m/s**. For steel (K = 160 GPa, ρ = 7,800 kg/m³): v = √(160×10⁹/7,800) = **4,529 m/s** for longitudinal waves. Temperature refraction: sound curves toward cooler air (slower speed), explaining why sounds carry farther over cool lakes at night.',
      advancedContent:
        'In **anisotropic materials** (wood, crystals), sound speed depends on direction — a concept described by the **Christoffel equation**: (C_ijkl × n_j × n_l − ρv²δ_ik) × p_k = 0, where C is the stiffness tensor. This is why a wooden instrument\'s tone depends on grain orientation. In **dispersive media**, speed depends on frequency — deep-ocean waves and seismic waves are dispersive, but audible sound in air is nearly non-dispersive. **Acoustic metamaterials** engineer artificial structures with negative effective bulk modulus or density, creating materials where sound bends backward (negative refraction) or cannot propagate at all (bandgaps). Researchers at Duke University (2014) built an acoustic "invisibility cloak" using metamaterial rings that guide sound waves around an object, making it acoustically invisible. The **phonon** — the quantum of sound — has energy E = ℏω and momentum p = ℏk, and its statistics (Bose-Einstein) determine the specific heat of solids (Debye model).',
    },
    {
      title: 'Echoes, Doppler Effect, and Sonic Booms',
      beginnerContent:
        'When sound waves hit a hard, flat surface like a cliff or a building wall, they bounce back — creating an echo. For you to hear a distinct echo, the reflecting surface needs to be at least about 17 metres away, because the reflected sound needs a slight time delay to be perceived separately from the original. The Doppler effect explains why a siren sounds higher-pitched as an ambulance approaches and lower-pitched as it drives away: the sound waves compress ahead of the moving source and stretch behind it. When an aircraft exceeds the speed of sound, it outruns its own sound waves, which pile up into a shock wave you hear as a sonic boom — a sharp, thunderous crack.',
      intermediateContent:
        'The **Doppler effect** formula for sound: **f_observed = f_source × (v ± v_observer) / (v ∓ v_source)**, where v = speed of sound. An ambulance siren at 700 Hz approaching at 30 m/s: f = 700 × 343/(343−30) = 700 × 343/313 = **767 Hz** (higher pitch). Driving away: f = 700 × 343/(343+30) = 700 × 343/373 = **644 Hz** (lower pitch). The **echo calculation**: distance = (v × t)/2 (divide by 2 because sound travels there and back). If you hear an echo 0.5 s after shouting: d = 343 × 0.5/2 = **85.75 m**. The minimum distance for a distinct echo: the brain needs ~0.1 s to separate two sounds, so d_min = 343 × 0.1/2 = **17.15 m**. The **Mach number** M = v_object/v_sound: M = 1 is the speed of sound; M = 2 means twice the speed of sound.',
      advancedContent:
        'The **Mach cone** half-angle is given by **sin θ = 1/M**. At Mach 2: θ = arcsin(0.5) = 30°. The shock wave sweeps along this cone behind the aircraft. Unlike popular belief, a sonic boom is not a one-time event at the moment of "breaking the barrier" — it is a continuous cone that follows the aircraft, sweeping across the ground. The **Rankine-Hugoniot conditions** describe the jump in pressure, density, and temperature across a shock front: p₂/p₁ = (2γM² − γ + 1)/(γ + 1). At Mach 2 in air: p₂/p₁ = (2×1.4×4 − 0.4)/2.4 = **4.5×** atmospheric pressure — enough to rattle windows. For light, the Doppler effect has a **relativistic form**: f_obs = f_source × √((1−β)/(1+β)), where β = v/c. This produces the **cosmological redshift** of distant galaxies, providing evidence for the expanding universe. Gravitational waves also exhibit Doppler-like frequency shifts as their sources move.',
      diagram: 'DopplerEffectDiagram',
    },
  ]
};
