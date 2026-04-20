import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'intro-to-relativity',
  title: 'Relativity',
  category: 'physics',
  icon: '🚀',
  tagline: "Why nothing travels faster than light, and why time itself can slow down.",
  relatedStories: ['little-train', 'stars-ziro-valley'],
  understand: [
    // ── Section 1: The Speed of Light ─────────────────────────
    {
      title: 'The Speed of Light',
      beginnerContent:
        'The speed of light in a vacuum is exactly **299,792,458 metres per second**. Scientists call it **c** — the fastest anything can travel in the universe. This is not an engineering limit to overcome with better engines. It is a law woven into the fabric of space and time itself.\n\n' +
        '**Analogy:** Imagine a river with a maximum current speed. No matter how powerful your boat engine, the river itself won\'t carry anything faster than that current. Light speed is the universe\'s "maximum current."\n\n' +
        '| Quantity | Value | Comparison |\n' +
        '|----------|-------|------------|\n' +
        '| Speed of light | 299,792 km/s | Circles Earth 7.5 times in 1 second |\n' +
        '| Speed of sound | 0.343 km/s | Takes 4.5 hours to circle Earth once |\n' +
        '| Fastest rocket (Parker Solar Probe) | 192 km/s | Still only 0.064% of light speed |\n' +
        '| Rajdhani Express (max) | 0.044 km/s | 6.8 billion times slower than light |\n\n' +
        'Because the universe is vast, astronomers measure distances in **light-years** — the distance light travels in one year:\n\n' +
        '| Object | Distance | What you see |\n' +
        '|--------|----------|--------------|\n' +
        '| The Moon | 1.3 light-seconds | As it was 1.3 seconds ago |\n' +
        '| The Sun | 8.3 light-minutes | As it was 8 minutes ago |\n' +
        '| Proxima Centauri (nearest star) | 4.24 light-years | As it was in 2022 |\n' +
        '| Andromeda Galaxy | 2.5 million light-years | As it was before humans existed |\n\n' +
        'When you look at the night sky from Ziro Valley in Arunachal Pradesh — one of the least light-polluted places in India — you are literally looking back in time. Every star you see is a snapshot from the past.\n\n' +
        '**Quick check:** If a star is 100 light-years away, and it exploded today, when would we see the explosion?\n\n' +
        '*In 100 years. The light carrying news of the explosion takes 100 years to reach us.*',
      intermediateContent:
        '**How was the speed of light measured?**\n\n' +
        '| Year | Scientist | Method | Result | Error |\n' +
        '|------|-----------|--------|--------|-------|\n' +
        '| 1676 | Romer | Timing of Jupiter\'s moon Io eclipses | 220,000 km/s | 27% low |\n' +
        '| 1849 | Fizeau | Spinning toothed wheel + mirror 8.6 km away | 315,000 km/s | 5% high |\n' +
        '| 1862 | Foucault | Rotating mirror | 298,000 km/s | 0.6% low |\n' +
        '| 1983 | CGPM | Defined exactly (redefined the metre) | **299,792,458 m/s** | Exact |\n\n' +
        '**Fizeau\'s method (1849):** Light passes through a gap in a spinning toothed wheel, reflects off a mirror 8.6 km away, and returns. At the right wheel speed (12.6 rev/s, 720 teeth), the returning light passes through the *next* gap:\n\n' +
        '`c = 2d / (gap time) = 2 x 8,633 / (1/(12.6 x 720)) = 315,000 km/s`\n\n' +
        'Since 1983, the metre is *defined* as the distance light travels in 1/299,792,458 of a second, making c exact by definition.\n\n' +
        '**The energy of a moving object:**\n\n' +
        'The full relativistic energy-momentum relation:\n\n' +
        '`E² = (pc)² + (mc²)²`\n\n' +
        '| Particle type | Mass | Momentum | Energy formula |\n' +
        '|---------------|------|----------|----------------|\n' +
        '| Photon (light) | m = 0 | p > 0 | E = pc |\n' +
        '| Particle at rest | m > 0 | p = 0 | E = mc² |\n' +
        '| Moving particle | m > 0 | p > 0 | E = gamma x mc² |\n\n' +
        'At v = 0.9c: gamma = 1/sqrt(1 - 0.81) = 1/sqrt(0.19) = **2.29**, so total energy is 2.29 times the rest energy.',
      advancedContent:
        '**Why is c constant for all observers?**\n\n' +
        'Maxwell\'s equations predict: `c = 1/sqrt(mu_0 x epsilon_0)`, independent of the source or observer\'s motion. In Newtonian mechanics, velocities add: a ball thrown at 20 m/s from a train moving at 30 m/s travels at 50 m/s for a ground observer. If light followed the same rule, its speed would depend on the source\'s motion.\n\n' +
        'The **Michelson-Morley experiment** (1887) tested this. An interferometer split a light beam into two perpendicular paths, reflected them back, and recombined them. If Earth\'s motion through space affected light speed, the two beams would return out of sync. Result: **no difference detected** — light speed was the same in all directions.\n\n' +
        '**The Lorentz transformation** (replacing the Galilean transformation):\n\n' +
        '| Galilean (wrong at high v) | Lorentz (correct) |\n' +
        '|---------------------------|-------------------|\n' +
        '| x\' = x - vt | x\' = gamma(x - vt) |\n' +
        '| t\' = t | t\' = gamma(t - vx/c²) |\n\n' +
        'Notice: in the Lorentz version, **time itself depends on position** (the vx/c² term). Space and time are mixed — they are not independent. This is why we speak of **spacetime** as a single entity.\n\n' +
        'The **spacetime interval** `ds² = c²dt² - dx² - dy² - dz²` is invariant — all observers agree on its value, even though they disagree on individual space and time measurements. This is the relativistic replacement for Euclidean distance.\n\n' +
        '**Tachyons** (hypothetical v > c particles) would require imaginary rest mass (m² < 0) and travel backward in time in some frames, violating causality. No tachyon has ever been detected.',
    },

    // ── Section 2: Time Dilation ──────────────────────────────
    {
      title: 'Time Dilation',
      diagram: 'LightClockDiagram',
      beginnerContent:
        'Moving clocks tick more slowly. This is not a metaphor or an illusion — it is a measured, confirmed fact of nature.\n\n' +
        '**Analogy:** Imagine two people walking from A to B. One walks straight. The other zigzags. The zigzagger covers more ground and takes longer. A moving clock is like the zigzagger — its "path through time" is longer, so it ticks fewer times.\n\n' +
        '**Try the diagram above** — drag the velocity slider to see how the light clock\'s bouncing light takes a longer path when the clock moves, causing it to tick slower.\n\n' +
        'The formula is: **time_observed = gamma x time_proper**, where gamma = 1/sqrt(1 - v²/c²)\n\n' +
        '| Speed (v) | gamma | What happens |\n' +
        '|-----------|-------|--------------|\n' +
        '| 0 (standing still) | 1.00 | No effect — time passes normally |\n' +
        '| 0.1c (10% of light) | 1.005 | Time 0.5% slower — unnoticeable |\n' +
        '| 0.5c (50% of light) | 1.15 | Time 15% slower |\n' +
        '| 0.87c | 2.00 | Time passes at **half** the rate |\n' +
        '| 0.99c | 7.09 | 1 year of travel = 7 years on Earth |\n' +
        '| 0.999c | 22.4 | 1 year of travel = 22 years on Earth |\n\n' +
        '**Real evidence:**\n\n' +
        '| Experiment | What happened | Match with Einstein? |\n' +
        '|-----------|--------------|---------------------|\n' +
        '| Hafele-Keating (1971) | Atomic clocks flown around the world lost 59 ns vs ground clocks | Yes, exact |\n' +
        '| Cosmic ray muons | Muons (lifespan 2.2 us) detected 10 km below creation point | Yes — gamma ~ 15 stretches their life |\n' +
        '| GPS satellites | Clocks drift 38 us/day without relativistic correction | Yes — corrected in firmware |\n\n' +
        '**The GPS story:** Without Einstein\'s corrections, your phone\'s map would be wrong by **10 km per day**. Every GPS satellite carries relativistic corrections. Relativity is not abstract — it is in your pocket.',
      intermediateContent:
        '**Worked example — muon survival:**\n\n' +
        'Muons are created at ~10 km altitude, travelling at 0.998c. Their rest-frame lifetime is 2.2 microseconds.\n\n' +
        '| Frame | Calculation | Result |\n' +
        '|-------|------------|--------|\n' +
        '| Muon\'s frame | Distance = v x t = 0.998c x 2.2 us | **659 m** — should not reach ground |\n' +
        '| Earth\'s frame | gamma = 1/sqrt(1 - 0.998²) = **15.8** | |\n' +
        '| | Dilated lifetime = 15.8 x 2.2 us = **34.8 us** | |\n' +
        '| | Distance = 0.998c x 34.8 us = **10,418 m** | Reaches the ground! |\n\n' +
        '(From the muon\'s frame, it\'s the Earth\'s atmosphere that is length-contracted to 659 m — same physics, different perspective.)\n\n' +
        '**Worked example — GPS correction:**\n\n' +
        '| Effect | Source | Daily drift |\n' +
        '|--------|--------|-------------|\n' +
        '| Special relativity (velocity) | Satellite speed v ~ 3.87 km/s | Clocks **lose** 7.2 us/day |\n' +
        '| General relativity (gravity) | Altitude h = 20,200 km | Clocks **gain** 45.9 us/day |\n' +
        '| **Net effect** | | **+38.7 us/day** |\n' +
        '| Position error without correction | c x 38.7 us | **11.6 km per day** |\n\n' +
        '**Calculation detail:**\n\n' +
        '- SR effect: (v/c)²/2 = (3870 / 3x10⁸)² / 2 = 8.35 x 10⁻¹¹ → 7.2 us/day slower\n' +
        '- GR effect: g x h / c² = 9.81 x 20,200,000 / (3x10⁸)² = 2.18 x 10⁻⁹ → 45.9 us/day faster',
      advancedContent:
        '**The Twin Paradox — resolved:**\n\n' +
        'Twin A stays on Earth. Twin B flies to Alpha Centauri (4.37 ly) at 0.9c and returns.\n\n' +
        '| Quantity | Twin A (Earth) | Twin B (traveller) |\n' +
        '|----------|---------------|-------------------|\n' +
        '| gamma | 1 | 2.29 |\n' +
        '| Trip distance (one way) | 4.37 ly | 4.37 / 2.29 = 1.91 ly (length-contracted) |\n' +
        '| Trip time (one way) | 4.37 / 0.9 = 4.86 years | 4.86 / 2.29 = 2.12 years |\n' +
        '| Total round trip | **9.71 years** | **4.24 years** |\n' +
        '| Age difference on return | Twin B is **5.47 years younger** | |\n\n' +
        'This is NOT a paradox. The situation is asymmetric: Twin B accelerates (changes frames), Twin A does not. The proper time along a worldline is `tau = integral of sqrt(1 - v²/c²) dt`. A straight worldline through spacetime (staying put) **maximises** proper time — the opposite of Euclidean geometry, where straight lines minimise distance.\n\n' +
        '**Gravitational time dilation** (general relativity):\n\n' +
        '`dt_observed = dt_proper / sqrt(1 - 2GM/(rc²)) = dt_proper / sqrt(1 - r_s/r)`\n\n' +
        '| Location | Time dilation relative to infinity |\n' +
        '|----------|-----------------------------------|\n' +
        '| Earth\'s surface | Slower by ~7 x 10⁻¹⁰ (0.7 parts per billion) |\n' +
        '| ISS orbit (408 km) | ~3% less gravitational dilation than surface |\n' +
        '| GPS orbit (20,200 km) | Noticeably faster — 45.9 us/day gain |\n' +
        '| Event horizon (r = r_s) | Time **stops** for a distant observer |\n\n' +
        'The Event Horizon Telescope images of M87* (2019) and Sgr A* (2022) show the "shadow" predicted by extreme time dilation and light bending near a black hole.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A clock moving at 0.87c runs at about half the rate of a stationary clock.', answer: true, explanation: 'At v = 0.87c, γ ≈ 2, so the moving clock ticks twice as slowly — elapsed time is halved from the stationary observer\'s perspective.' },
            { text: 'The twin paradox is a true paradox with no resolution in special relativity.', answer: false, explanation: 'It is not a real paradox. The travelling twin accelerates (changes reference frames), breaking the symmetry. The stay-at-home twin ages more.' },
            { text: 'GPS satellites must correct for both special and general relativistic time dilation to stay accurate.', answer: true, explanation: 'GPS clocks gain ~45.9 μs/day from weaker gravity (general relativity) and lose ~7.2 μs/day from orbital speed (special relativity). Without corrections, positions would drift ~10 km/day.' },
            { text: 'At the event horizon of a black hole, time passes normally for a falling observer.', answer: true, explanation: 'A freely falling observer notices nothing special at the event horizon — time passes normally for them. It is only a distant observer who sees the falling clock slow to a stop.' },
          ],
        },
      },
    },

    // ── Section 3: E = mc² ────────────────────────────────────
    {
      title: 'E = mc²',
      diagram: 'EMCSquaredDiagram',
      beginnerContent:
        'Einstein\'s most famous equation says: **mass and energy are two forms of the same thing.**\n\n' +
        '**Analogy:** Think of ice and water. They look different, but they are the same substance in different forms. Mass and energy are like that — you can convert one into the other. The "exchange rate" is c², which is enormous.\n\n' +
        '`E = mc²`\n' +
        '`c² = (3 x 10⁸)² = 9 x 10¹⁶ m²/s²`\n\n' +
        'This means a tiny amount of mass contains a staggering amount of energy:\n\n' +
        '| Mass converted | Energy released | Equivalent to |\n' +
        '|---------------|----------------|---------------|\n' +
        '| 1 kg | 9 x 10¹⁶ J | 21 megatons of TNT — powers a city for years |\n' +
        '| 1 g (a paperclip) | 9 x 10¹³ J | Hiroshima bomb (15,000 tonnes of TNT) |\n' +
        '| 1 mg (a grain of sand) | 9 x 10¹⁰ J | 21 tonnes of TNT |\n' +
        '| 0.3 nanograms | 3 x 10⁷ J | Burning 1 kg of coal |\n\n' +
        '**Where does this happen in nature?**\n\n' +
        '| Process | Mass converted | Where |\n' +
        '|---------|---------------|-------|\n' +
        '| Nuclear fusion (4H -> He) | 0.7% of hydrogen mass | Every star, including the Sun |\n' +
        '| Nuclear fission (U-235 splitting) | 0.09% of uranium mass | Nuclear power plants, reactors |\n' +
        '| Matter-antimatter annihilation | 100% of both particles | PET medical scanners |\n' +
        '| Chemical burning (coal, petrol) | 0.0000001% | Too small to measure on a scale |\n\n' +
        'The Sun converts **4.3 million tonnes of mass into energy every second** — and has been doing so for 4.6 billion years. The warmth on your face in a Jorhat tea garden is E = mc² at work, from 150 million km away.\n\n' +
        '**Why you can\'t reach light speed:** As an object speeds up, its kinetic energy increases. Since energy = mass (E = mc²), the object\'s effective inertia grows. Near c, the inertia approaches infinity, requiring infinite energy. This is not a barrier to overcome — it is the structure of spacetime.',
      intermediateContent:
        '**Worked example 1 — Full conversion (1 kg):**\n\n' +
        '`E = mc² = 1 x (3 x 10⁸)² = 9 x 10¹⁶ J`\n\n' +
        'India consumed ~1,600 TWh of electricity in 2023. That is 1,600 x 10⁹ x 3600 = 5.76 x 10¹⁸ J per year. So 1 kg of matter fully converted would power India for 9 x 10¹⁶ / (5.76 x 10¹⁸ / 365) = **~5.7 days**.\n\n' +
        '**Worked example 2 — Nuclear fission of 1 kg U-235:**\n\n' +
        '`Only 0.09% converts: E = 0.0009 x 1 x (3 x 10⁸)² = 8.1 x 10¹³ J = 22.5 million kWh`\n\n' +
        '**Worked example 3 — The Sun\'s energy budget:**\n\n' +
        '| Quantity | Value |\n' +
        '|----------|-------|\n' +
        '| Luminosity (power output) | 3.846 x 10²⁶ W |\n' +
        '| Mass converted per second | P/c² = 3.846 x 10²⁶ / (9 x 10¹⁶) = **4.27 x 10⁹ kg/s** |\n' +
        '| Total mass | 1.989 x 10³⁰ kg |\n' +
        '| Fraction converted in 10 billion years | ~0.07% |\n\n' +
        '**Worked example 4 — Electron-positron annihilation (PET scanner):**\n\n' +
        '`E = 2 x m_e x c² = 2 x 9.109 x 10⁻³¹ x (3 x 10⁸)² = 1.637 x 10⁻¹³ J = 1.022 MeV`\n\n' +
        'This produces two gamma-ray photons, each with 511 keV, flying in opposite directions. PET scanners detect these pairs to build 3D images of tumour locations.\n\n' +
        '**Energy comparison table:**\n\n' +
        '| Fuel source (1 kg) | Energy (J) | Mass converted | Ratio to coal |\n' +
        '|--------------------|-----------|---------------|---------------|\n' +
        '| Coal (burning) | 3 x 10⁷ | 0.3 ng | 1x |\n' +
        '| TNT (detonation) | 4.6 x 10⁶ | 0.05 ng | 0.15x |\n' +
        '| Uranium-235 (fission) | 8.1 x 10¹³ | 0.9 g | **2,700,000x** |\n' +
        '| Deuterium (fusion) | 3.4 x 10¹⁴ | 3.8 g | **11,300,000x** |\n' +
        '| Full conversion (matter + antimatter) | 9 x 10¹⁶ | 1,000 g | **3,000,000,000x** |',
      advancedContent:
        '**The full energy-momentum relation:**\n\n' +
        '`E² = (pc)² + (m₀c²)²`\n\n' +
        'This is a hyperbola in energy-momentum space. Three special cases:\n\n' +
        '| Case | Condition | Result |\n' +
        '|------|-----------|--------|\n' +
        '| Particle at rest | p = 0 | E = m₀c² (rest energy) |\n' +
        '| Massless particle | m₀ = 0 | E = pc (all energy is momentum) |\n' +
        '| Ultrarelativistic | E >> m₀c² | E ≈ pc (mass is negligible) |\n\n' +
        '**Radiation pressure** from massless photons:\n\n' +
        '- Absorbed light: P = I/c = 1361 / (3 x 10⁸) = **4.5 x 10⁻⁶ Pa** (at Earth\'s distance from Sun)\n' +
        '- Reflected light: P = 2I/c = **9.1 x 10⁻⁶ Pa**\n\n' +
        'This tiny pressure is enough to push a solar sail spacecraft — JAXA\'s IKAROS (2010) demonstrated this.\n\n' +
        '**Nuclear binding energy and the mass defect:**\n\n' +
        'A helium-4 nucleus weighs less than its parts:\n\n' +
        '| Component | Mass (u) |\n' +
        '|-----------|----------|\n' +
        '| 2 protons | 2 x 1.00728 = 2.01456 |\n' +
        '| 2 neutrons | 2 x 1.00866 = 2.01732 |\n' +
        '| **Sum of parts** | **4.03188** |\n' +
        '| Helium-4 nucleus | **4.00260** |\n' +
        '| **Mass defect** | **0.02928 u = 27.3 MeV** |\n\n' +
        'This 0.7% mass defect is the binding energy — released when the nucleus assembles. It is why atomic masses are not exact integers, and why fusion powers stars.\n\n' +
        '**The Higgs mechanism:** Elementary particles get mass through interaction with the Higgs field. Strongly interacting particles (top quark: m = 173 GeV/c²) are heavy; non-interacting particles (photon) are massless. Confirmed by the Higgs boson discovery at CERN in 2012.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each process to its mass-energy conversion',
          pairs: [
            ['Chemical burning (coal)', 'Converts ~0.0000001% of mass — too small to weigh'],
            ['Nuclear fission (uranium)', 'Converts ~0.09% of mass — powers nuclear reactors'],
            ['Nuclear fusion (hydrogen)', 'Converts ~0.7% of mass — powers every star'],
            ['Matter-antimatter annihilation', 'Converts 100% of mass — used in PET scanners'],
          ],
        },
      },
    },

    // ── Section 4: Relativity in Daily Life ───────────────────
    {
      title: 'Relativity in Daily Life',
      beginnerContent:
        'Relativity is not abstract — it is the physics behind your phone, your medical scans, and the star that sustains all life.\n\n' +
        '**Analogy:** People think of relativity like quantum mechanics — weird, irrelevant, only for physicists. But while you may never meet a quantum effect in daily life, you *use* relativity every time you open Google Maps.\n\n' +
        '| Application | Relativistic effect | What happens without it |\n' +
        '|-------------|--------------------|-----------------------|\n' +
        '| GPS navigation | Time dilation (SR + GR) | Position off by 10+ km/day |\n' +
        '| PET medical scans | E = mc² (matter-antimatter annihilation) | No way to image tumours non-invasively |\n' +
        '| Nuclear power | E = mc² (fission) | No nuclear energy |\n' +
        '| Sunshine | E = mc² (fusion) | No Sun, no life |\n' +
        '| Gold\'s colour | Relativistic electron speeds | Gold would look silver |\n' +
        '| Lead-acid car batteries | Relativistic effect on lead | Batteries would produce 80% less voltage |\n\n' +
        '**The gold connection:** Gold\'s inner electrons orbit so fast (due to the heavy nucleus) that relativistic effects shrink their orbits and change which wavelengths of light gold absorbs. Without relativity, gold would reflect all visible light equally — it would look **silver**. The same effect makes mercury liquid at room temperature.\n\n' +
        'The Indian Space Research Organisation (ISRO) applies relativistic corrections to the NavIC satellite navigation system (India\'s regional GPS alternative, 7 satellites). IIT Guwahati conducts research on relativistic plasma physics and high-energy particle interactions, while Tezpur University has published on relativistic astrophysics, studying pulsars and neutron star physics.\n\n' +
        '**Quick check:** If GPS satellites did not correct for relativity, how far off would your location be after one week?\n\n' +
        '*About 10 km/day x 7 = 70 km — you\'d think you were in a completely different district!*',
      intermediateContent:
        '**GPS — the most precise test of relativity in your pocket:**\n\n' +
        '| Parameter | Value |\n' +
        '|-----------|-------|\n' +
        '| Number of satellites | 24-32 (US GPS); 7 (NavIC, India) |\n' +
        '| Orbital altitude | 20,200 km (GPS); 36,000 km (NavIC GEO) |\n' +
        '| Orbital speed | 3.87 km/s (GPS) |\n' +
        '| Clock precision | ~1 nanosecond |\n' +
        '| SR time dilation (velocity) | Clocks lose 7.2 us/day |\n' +
        '| GR time dilation (gravity) | Clocks gain 45.9 us/day |\n' +
        '| Net daily correction | +38.7 us/day |\n' +
        '| Error without correction | 11.6 km/day |\n\n' +
        '**PET scanner physics — E = mc² in a hospital:**\n\n' +
        '| Step | What happens |\n' +
        '|------|-------------|\n' +
        '| 1. Injection | Patient receives ¹⁸F-FDG (radioactive glucose) |\n' +
        '| 2. Accumulation | Cancer cells consume more glucose → tracer concentrates in tumours |\n' +
        '| 3. Decay | ¹⁸F emits a positron (antimatter electron) |\n' +
        '| 4. Annihilation | Positron meets electron within ~1 mm → both destroyed |\n' +
        '| 5. Gamma rays | Two 511 keV photons fly in opposite directions (E = mc²) |\n' +
        '| 6. Detection | Ring of detectors captures both photons within ~10 ns |\n' +
        '| 7. Reconstruction | Computer builds 3D image from thousands of photon pairs |\n\n' +
        '**Particle accelerators — where relativity dominates:**\n\n' +
        '| Accelerator | Particle speed | gamma | Effective mass |\n' +
        '|------------|---------------|-------|----------------|\n' +
        '| Medical cyclotron | 0.14c | 1.01 | ~1% heavier |\n' +
        '| Tevatron (Fermilab) | 0.99999954c | 1,000 | 1,000x rest mass |\n' +
        '| LHC (CERN) | 0.999999991c | 7,462 | 7,462x rest mass |\n\n' +
        'At LHC energies, each proton has kinetic energy equivalent to a flying mosquito (~1 microjoule) — concentrated in a volume of ~1 femtometre cubed.',
      advancedContent:
        '**Modern precision tests of relativity:**\n\n' +
        '| Experiment | Year | What was tested | Precision |\n' +
        '|-----------|------|----------------|----------|\n' +
        '| Gravity Probe B | 2004-05 | Geodetic precession of gyroscopes in orbit | 0.28% match with GR |\n' +
        '| Gravity Probe B | 2004-05 | Frame-dragging (spacetime twisted by Earth\'s rotation) | 19% match with GR |\n' +
        '| LIGO/Virgo (GW150914) | 2015 | Gravitational waves from merging black holes | Confirmed GR prediction |\n' +
        '| EHT (M87*) | 2019 | Black hole shadow — extreme time dilation + light bending | Matches GR |\n' +
        '| EHT (Sgr A*) | 2022 | Milky Way\'s central black hole | Matches GR |\n' +
        '| GW170817 | 2017 | Speed of gravity vs speed of light | |v_grav - c|/c < 3 x 10⁻¹⁵ |\n\n' +
        '**Gravitational waves — ripples in spacetime:**\n\n' +
        'When massive objects accelerate (merging black holes, neutron stars), they create ripples in spacetime itself — gravitational waves. LIGO detects these by measuring length changes of ~10⁻¹⁸ metres (1/1000 the diameter of a proton) over 4 km arms.\n\n' +
        'The neutron star merger GW170817 (2017) was detected in both gravitational waves and light (gamma rays). The signals arrived within **1.7 seconds** of each other after travelling **130 million light-years**. This constrains:\n\n' +
        '`|v_gravity - c| / c < 3 x 10⁻¹⁵`\n\n' +
        '— the most precise confirmation that gravity travels at exactly the speed of light.\n\n' +
        '**Relativistic heavy-ion collisions** at the LHC (Pb-Pb at sqrt(s_NN) = 5.02 TeV) create a **quark-gluon plasma** at temperatures exceeding 4 x 10¹² K, where quarks and gluons exist freely for ~10⁻²³ seconds before hadronising. This reproduces conditions ~10 microseconds after the Big Bang.\n\n' +
        '**Why gold is gold and mercury is liquid:**\n\n' +
        'Gold\'s 79 electrons include inner s-electrons that "orbit" at ~58% of light speed. At this speed, gamma = 1.22, causing the orbital to contract by ~22%. This shifts gold\'s absorption edge into the blue range, making it reflect yellow/red — giving gold its distinctive colour. Without relativity, gold would reflect uniformly like silver. The same relativistic contraction weakens mercury\'s interatomic bonds, making it liquid at room temperature.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            {
              text: 'GPS would work fine without relativistic corrections — the error is too small to matter.',
              answer: false,
              explanation: 'Without corrections, GPS positions would drift by ~11.6 km per day. After a week, your phone would place you 80 km away. Every GPS satellite carries Einstein\'s equations in its firmware.',
            },
            {
              text: 'Gold\'s yellow colour is caused by relativistic effects on its inner electrons.',
              answer: true,
              explanation: 'Gold\'s inner s-electrons move at ~58% of c. Relativistic orbital contraction shifts which wavelengths gold absorbs, making it reflect yellow. Without relativity, gold would look silver.',
            },
            {
              text: 'The speed of gravity has been confirmed to equal the speed of light.',
              answer: true,
              explanation: 'The neutron star merger GW170817 produced gravitational waves and gamma rays that arrived within 1.7 seconds of each other after 130 million light-years of travel, confirming |v_gravity - c|/c < 3 x 10⁻¹⁵.',
            },
            {
              text: 'PET scanners detect X-rays bouncing off tumours.',
              answer: false,
              explanation: 'PET scanners detect gamma rays from matter-antimatter annihilation (E = mc²). A positron from a radioactive tracer meets an electron, both are destroyed, and two 511 keV gamma photons fly in opposite directions.',
            },
          ],
        },
      },
    },
  ],
};
