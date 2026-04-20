import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'altitude-and-atmosphere',
  title: 'Altitude & Atmosphere',
  category: 'physics',
  icon: '🏔️',
  tagline: 'Why mountains are cold, air thins with height, and the atmosphere has layers.',
  relatedStories: ['snow-leopards-promise', 'snow-leopard'],
  understand: [
    // ── Section 1: The Atmosphere ──────────────────────────────
    {
      title: 'The Atmosphere — Earth\'s Blanket of Air',
      diagram: 'AltitudeProfileDiagram',
      beginnerContent:
        'Earth\'s atmosphere is a thin shell of gas held in place by gravity, stretching about 100 km above the surface before fading into space. How thin? If Earth were an apple, the atmosphere would be thinner than the apple\'s skin. Yet this razor-thin layer does *everything* that keeps us alive.\n\n' +
        '| What the atmosphere does | How it does it |\n' +
        '|--------------------------|----------------|\n' +
        '| Provides breathable air | 21% oxygen in every breath |\n' +
        '| Blocks harmful UV rays | Ozone layer absorbs 97-99% of UV-B |\n' +
        '| Keeps Earth warm | CO₂ and water vapour trap heat (greenhouse effect) |\n' +
        '| Creates weather | Water evaporates, rises, condenses into rain |\n' +
        '| Burns up meteors | Friction with air molecules destroys most space rocks |\n\n' +
        'The atmosphere is a *mixture* of gases, not a single substance:\n\n' +
        '| Gas | Percentage | Role |\n' +
        '|-----|-----------|------|\n' +
        '| **Nitrogen (N₂)** | 78% | Inert — dilutes oxygen so things don\'t catch fire too easily |\n' +
        '| **Oxygen (O₂)** | 21% | Breathing, combustion, rust |\n' +
        '| **Argon (Ar)** | 0.93% | Inert noble gas — does nothing special |\n' +
        '| **Carbon dioxide (CO₂)** | 0.042% (420 ppm) | Tiny amount, but traps enormous heat |\n' +
        '| **Water vapour (H₂O)** | 0–4% (varies) | Clouds, rain, strongest natural greenhouse gas |\n\n' +
        'The Brahmaputra Valley is one of the most humid places on Earth. On a monsoon day in Guwahati, water vapour can make up 3-4% of the air — nearly 100 times more than CO₂. All that moisture is what fuels the thunderstorms that roll across Kamrup every afternoon in June.\n\n' +
        '**Quick check:** CO₂ is only 0.042% of the atmosphere. How can such a tiny amount matter?\n\n' +
        '*Because CO₂ absorbs infrared radiation that other gases ignore. Without it, Earth\'s average temperature would be -18 °C instead of +15 °C. A little goes a very long way.*',
      intermediateContent:
        'The total mass of Earth\'s atmosphere is approximately **5.15 x 10¹⁸ kg** — enormous, but only 0.00009% of Earth\'s total mass.\n\n' +
        '**Composition by mole fraction (dry air):**\n\n' +
        '| Gas | Mole fraction | Molecular mass (g/mol) | Contribution to mean M |\n' +
        '|-----|--------------|----------------------|------------------------|\n' +
        '| N₂ | 0.7809 | 28.01 | 21.87 |\n' +
        '| O₂ | 0.2095 | 32.00 | 6.70 |\n' +
        '| Ar | 0.0093 | 39.95 | 0.37 |\n' +
        '| CO₂ | 0.0004 | 44.01 | 0.02 |\n' +
        '| **Mean** | | | **28.97 g/mol** |\n\n' +
        '**Worked example — number density at sea level:**\n\n' +
        'Using the ideal gas law PV = nRT, the number density is:\n\n' +
        'n/V = P/(kT) = 101,325 / (1.38 x 10⁻²³ x 288) = **2.55 x 10²⁵ molecules/m³**\n\n' +
        'This is called the **Loschmidt number** at STP.\n\n' +
        '**Scale height** — the altitude over which pressure drops by a factor of e (2.718):\n\n' +
        '| Parameter | Value | Source |\n' +
        '|-----------|-------|--------|\n' +
        '| R (gas constant) | 8.314 J/(mol·K) | Universal constant |\n' +
        '| T (temperature) | 288 K | Sea-level average |\n' +
        '| M (molar mass) | 0.02897 kg/mol | Calculated above |\n' +
        '| g (gravity) | 9.81 m/s² | Surface gravity |\n' +
        '| **H = RT/(Mg)** | **8,430 m ≈ 8.4 km** | Scale height |\n\n' +
        'This means ~63% of the atmosphere\'s mass lies below 8.4 km — lower than most Himalayan peaks.',
      advancedContent:
        'The atmosphere\'s vertical structure is governed by the **hydrostatic equation**: dP/dz = -ρg, where ρ is air density and g is gravitational acceleration. Combined with the ideal gas law, this yields the **barometric formula** for an isothermal atmosphere:\n\n' +
        'P(z) = P₀ x exp(-Mgz/RT)\n\n' +
        'Real atmospheres have temperature gradients, requiring integration through discrete layers using the **hypsometric equation**:\n\n' +
        'Δz = (R_d x T̄ / g) x ln(P₁/P₂)\n\n' +
        'where T̄ is the mean virtual temperature of the layer.\n\n' +
        '| Property | Isothermal model | Real atmosphere |\n' +
        '|----------|-----------------|------------------|\n' +
        '| Temperature profile | Constant T | Piecewise linear (ISA layers) |\n' +
        '| Pressure formula | Exponential decay | Power law per layer |\n' +
        '| Accuracy at 10 km | ~15% error | <1% error (ISA) |\n' +
        '| Use case | Quick estimates | Aviation, rocketry |\n\n' +
        '| Circulation cell | Latitude range | Energy transport | Key feature |\n' +
        '|-----------------|---------------|-----------------|-------------|\n' +
        '| Hadley | 0-30° | ~3.5 x 10¹⁵ W poleward | Trade winds, ITCZ |\n' +
        '| Ferrel | 30-60° | ~1.5 x 10¹⁵ W poleward | Westerlies, mid-latitude storms |\n' +
        '| Polar | 60-90° | ~0.5 x 10¹⁵ W poleward | Polar easterlies |\n' +
        '| **Total** | | **~5.5 x 10¹⁵ W** | Redistribution of solar heat |\n\n' +
        'The atmosphere is a **non-equilibrium thermodynamic system** driven by differential solar heating between equator and poles. It also exhibits **chaotic dynamics** — Lorenz (1963) demonstrated that tiny perturbations in initial conditions grow exponentially, fundamentally limiting weather prediction to approximately 10-14 days.',
    },

    // ── Section 2: Layers ──────────────────────────────────────
    {
      title: 'Layers of the Atmosphere',
      beginnerContent:
        'The atmosphere is divided into layers based on how temperature changes with altitude. Think of it like floors in a building — each floor has a completely different character.\n\n' +
        '| Layer | Altitude | Temperature trend | What happens there |\n' +
        '|-------|----------|-------------------|--------------------|\n' +
        '| **Troposphere** | 0-12 km | Gets colder as you go up (-6.5 °C/km) | ALL weather: rain, wind, clouds, storms |\n' +
        '| **Stratosphere** | 12-50 km | Gets *warmer* (ozone absorbs UV) | Ozone layer, jet aircraft cruise here |\n' +
        '| **Mesosphere** | 50-80 km | Gets colder again | Meteors burn up ("shooting stars") |\n' +
        '| **Thermosphere** | 80-700 km | Extremely hot (>1,000 °C) | ISS orbits here, auroras glow |\n' +
        '| **Exosphere** | 700+ km | Fades into space | Satellites, molecules escaping Earth |\n\n' +
        '**Wait — the thermosphere is over 1,000 °C but astronauts don\'t burn?** Temperature measures the *speed* of individual molecules. Up there, molecules are incredibly fast (hot) but incredibly *rare* — so spread out that they almost never touch your skin. It\'s like the difference between a single spark (hot but harmless) and a pot of boiling water (less hot but dangerous because there are trillions of water molecules hitting you).\n\n' +
        'When you see a "shooting star" over the Kaziranga night sky, you\'re watching a tiny rock burning up in the mesosphere — 50 to 80 km overhead. The flash lasts a second, but the rock was travelling at 20-70 km/s.\n\n' +
        '| Everyday experience | Atmosphere layer involved |\n' +
        '|---------------------|-------------------------|\n' +
        '| Rain on your roof | Troposphere (clouds form here) |\n' +
        '| Sunburn at the beach | Stratosphere (ozone failed to block all UV) |\n' +
        '| Shooting star at night | Mesosphere (meteor burns up) |\n' +
        '| Northern lights (aurora) | Thermosphere (solar wind hits gas) |\n' +
        '| GPS satellite signal | Exosphere (satellite orbits) |',
      intermediateContent:
        'Each layer boundary is defined by a temperature reversal called a **pause**.\n\n' +
        '| Boundary | Altitude | Temperature | What reverses |\n' +
        '|----------|----------|-------------|---------------|\n' +
        '| **Tropopause** | 8-18 km (varies by latitude) | -55 to -80 °C | Lapse rate drops below 2 °C/km |\n' +
        '| **Stratopause** | ~50 km | ~0 °C | Ozone heating peaks, then fades |\n' +
        '| **Mesopause** | ~85 km | **-90 °C** (coldest in atmosphere) | Radiation cooling ends |\n' +
        '| **Thermopause** | ~500-700 km | ~1,500 °C | Transition to exosphere |\n\n' +
        'The tropopause altitude matters for aviation — jet aircraft cruise near it (~10-12 km at mid-latitudes) to minimise drag in thinner air while avoiding stratospheric turbulence.\n\n' +
        '**Ozone — Earth\'s sunscreen:**\n\n' +
        'Ozone (O₃) absorbs UV-B radiation (280-315 nm) via: O₃ + hv → O₂ + O, releasing kinetic energy that heats the stratosphere.\n\n' +
        '| Ozone fact | Value |\n' +
        '|-----------|-------|\n' +
        '| Total column (global average) | ~300 Dobson units (DU) |\n' +
        '| If compressed to sea-level pressure | Only **3 mm thick** |\n' +
        '| UV-B blocked | 97-99% |\n' +
        '| Antarctic ozone hole (worst, 2006) | ~100 DU |\n' +
        '| Recovery expected by | ~2065 (Montreal Protocol) |\n\n' +
        'A layer just 3 mm thick blocks nearly all harmful UV — one of nature\'s most efficient shields.',
      advancedContent:
        'The thermosphere\'s high kinetic temperature (>1,000 °C) is misleading. **Temperature** here reflects average kinetic energy per molecule, but particle density is negligible:\n\n' +
        '| Altitude | Number density (molecules/cm³) | Mean free path | Regime |\n' +
        '|----------|-------------------------------|----------------|--------|\n' +
        '| Sea level | ~2.5 x 10¹⁹ | ~68 nm | Continuum (fluid) |\n' +
        '| 100 km | ~5 x 10¹³ | ~0.1 m | Transition |\n' +
        '| 200 km | ~5 x 10⁹ | ~100 m | Free molecular |\n' +
        '| 500 km | ~10⁷ | ~100 km | Exosphere |\n\n' +
        'The **Knudsen number** Kn = λ/L (mean free path / characteristic length) exceeds 1 above ~200 km, meaning continuum fluid equations break down and individual molecular trajectories dominate.\n\n' +
        '**Ionospheric layers** form in the thermosphere as solar EUV radiation ionises N₂ and O₂:\n\n' +
        '| Layer | Altitude (km) | Peak electron density (cm⁻³) | Reflects frequencies |\n' +
        '|-------|--------------|------------------------------|---------------------|\n' +
        '| D | 60-90 | 10² - 10³ | Absorbs MF/HF (daytime only) |\n' +
        '| E | 90-150 | ~10⁵ | Reflects MF at night |\n' +
        '| F₁ | 150-200 | ~5 x 10⁵ | Merges with F₂ at night |\n' +
        '| F₂ | 200-500 | ~10⁶ | Reflects HF — long-distance radio |\n\n' +
        'Above ~500 km, the **exosphere** begins. The mean free path exceeds the scale height, and molecules on escape trajectories (v > v_escape = sqrt(2gR) ≈ 11.2 km/s) leave Earth permanently. This **Jeans escape** has caused Earth to lose nearly all its primordial hydrogen and helium over geological time.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each atmospheric layer to its key feature',
          pairs: [
            ['Troposphere (0-12 km)', 'Where all weather occurs — temperature decreases with altitude'],
            ['Stratosphere (12-50 km)', 'Contains the ozone layer — temperature increases with altitude'],
            ['Mesosphere (50-80 km)', 'Where meteors burn up — temperature drops again'],
            ['Thermosphere (80-700 km)', 'Where the ISS orbits — extremely hot but air is too thin to feel'],
          ],
        },
      },
    },

    // ── Section 3: Atmospheric Pressure ────────────────────────
    {
      title: 'Atmospheric Pressure — Why It Decreases with Height',
      diagram: 'AltitudeProfileDiagram',
      beginnerContent:
        'Air has weight. The entire column of air above you — stretching to the edge of space — presses down with a force of about **101,325 Pascals** at sea level. That\'s roughly **1 kg pressing on every square centimetre** of your body.\n\n' +
        '**Why don\'t you feel crushed?** Because the pressure pushes equally in *all* directions — including outward from inside your body. The forces cancel out.\n\n' +
        'As you climb higher, there is less air above you, so the pressure drops:\n\n' +
        '| Location | Altitude | Pressure | % of sea level | What it feels like |\n' +
        '|----------|----------|----------|---------------|--------------------|\n' +
        '| Guwahati (Brahmaputra plain) | ~55 m | 100,700 Pa | 99% | Normal — no effect |\n' +
        '| Shillong (Meghalaya) | ~1,500 m | 84,600 Pa | 83% | Slight breathlessness on exertion |\n' +
        '| Tawang (Arunachal Pradesh) | ~3,048 m | 70,100 Pa | 69% | Headache if not acclimatised |\n' +
        '| Everest Base Camp | ~5,364 m | 53,500 Pa | 53% | Altitude sickness common |\n' +
        '| Everest summit | ~8,849 m | 33,700 Pa | 33% | Supplemental oxygen needed |\n\n' +
        '**Why altitude sickness?** Fewer air molecules per breath means less oxygen. At 5,500 m, you breathe in roughly *half* the oxygen you get at sea level. Your body struggles — headache, dizziness, nausea, fatigue.\n\n' +
        '| Altitude sickness stage | Altitude | Symptoms |\n' +
        '|------------------------|----------|----------|\n' +
        '| Mild (AMS) | 2,500-3,500 m | Headache, nausea, poor sleep |\n' +
        '| Moderate | 3,500-5,500 m | Vomiting, extreme fatigue, confusion |\n' +
        '| Severe (HAPE/HACE) | >5,500 m | Fluid in lungs or brain — can be fatal |\n\n' +
        '**Tawang connection:** Soldiers and tourists arriving in Tawang (3,048 m) from the plains of Assam often experience mild AMS on their first day. The Indian Army mandates a 24-hour acclimatisation halt at Dirang (1,500 m) before proceeding to Tawang.',
      intermediateContent:
        'Pressure decreases approximately exponentially: **P(h) = P₀ x e^(-h/H)**, where P₀ = 101,325 Pa and H ≈ 8,430 m.\n\n' +
        '**Worked example — pressure at NE India locations:**\n\n' +
        '| Location | h (m) | e^(-h/8430) | P (Pa) | P (% of sea level) |\n' +
        '|----------|-------|-------------|--------|--------------------|\n' +
        '| Shillong | 1,500 | 0.837 | 84,810 | 83.7% |\n' +
        '| Tawang | 3,048 | 0.696 | 70,520 | 69.6% |\n' +
        '| Everest Base Camp | 5,364 | 0.529 | 53,600 | 52.9% |\n' +
        '| Everest summit | 8,849 | 0.349 | 35,360 | 34.9% |\n\n' +
        '**Oxygen partial pressure and the "death zone":**\n\n' +
        'The partial pressure of oxygen follows the same decay: pO₂ = 0.2095 x P.\n\n' +
        '| Altitude | pO₂ (Pa) | Blood O₂ saturation (SpO₂) | Effect |\n' +
        '|----------|---------|---------------------------|--------|\n' +
        '| Sea level | 21,228 | ~98% | Normal |\n' +
        '| 3,000 m | 14,900 | ~93% | Mild hypoxia |\n' +
        '| 5,500 m | 11,060 | ~85% | Significant impairment |\n' +
        '| 7,000 m | 8,200 | ~70% | "Death zone" begins |\n' +
        '| 8,849 m | 7,000 | ~55% | Consciousness fading |\n\n' +
        'The **oxygen-haemoglobin dissociation curve** is S-shaped: above pO₂ ~8,000 Pa, saturation stays high (the "plateau"). Below it, saturation drops sharply — this is why the transition from 5,500 m to 7,000 m feels so much worse than from sea level to 3,000 m.',
      advancedContent:
        'The barometric formula assumes an isothermal atmosphere. Real atmospheres require the **International Standard Atmosphere (ISA)** model with piecewise linear temperature profiles.\n\n' +
        '**Troposphere (0-11 km, lapse rate Γ = 6.5 K/km):**\n\n' +
        'P = P₀(T/T₀)^(g₀M/RΓ)\n\n' +
        '| Parameter | Value |\n' +
        '|-----------|-------|\n' +
        '| g₀M/RΓ | 9.807 x 0.02897 / (8.314 x 0.0065) = **5.256** |\n' +
        '| T at 11 km | 288.15 - 6.5 x 11 = **216.65 K** |\n' +
        '| P at 11 km | 101,325 x (216.65/288.15)^5.256 = **22,632 Pa** |\n\n' +
        'For isothermal layers (stratosphere 11-20 km, T = 216.65 K): the exponential formula applies directly.\n\n' +
        '| ISA layer | Base (km) | Top (km) | Lapse rate (K/km) | Base T (K) | Base P (Pa) |\n' +
        '|-----------|-----------|----------|-------------------|-----------|-------------|\n' +
        '| Troposphere | 0 | 11 | -6.5 | 288.15 | 101,325 |\n' +
        '| Tropopause | 11 | 20 | 0 | 216.65 | 22,632 |\n' +
        '| Stratosphere 1 | 20 | 32 | +1.0 | 216.65 | 5,475 |\n' +
        '| Stratosphere 2 | 32 | 47 | +2.8 | 228.65 | 868 |\n' +
        '| Stratopause | 47 | 51 | 0 | 270.65 | 111 |\n\n' +
        '**Pressure altitude** — the ISA altitude corresponding to measured pressure — differs from geometric altitude by hundreds of metres in extreme weather. Pilots set altimeters to local QNH for approach. The relationship P-to-density also affects **true airspeed**: IAS must be corrected by sqrt(ρ₀/ρ) to get TAS at altitude.',
    },

    // ── Section 4: Temperature Lapse Rate ──────────────────────
    {
      title: 'Temperature Lapse Rate — Why Mountains Are Cold',
      beginnerContent:
        'Here\'s a question that seems obvious but isn\'t: **why are mountains cold?**\n\n' +
        'Mountains are *closer* to the Sun. Shouldn\'t they be warmer? No — and the reason reveals something fundamental about how the atmosphere works.\n\n' +
        '**The Sun heats the *ground*, not the air.** Sunlight passes through the atmosphere mostly unabsorbed, hits the ground, and the ground warms the air above it — like a stove warming a kitchen. Air higher up is farther from the "stove" and also at lower pressure, which causes it to expand and cool.\n\n' +
        'In the troposphere, temperature drops by about **6.5 °C for every 1,000 metres** of altitude gain. This is the **environmental lapse rate**.\n\n' +
        '| Location | Altitude | Expected temperature (if Guwahati is 35 °C) |\n' +
        '|---------------------|----------|----------------------------------------------|\n' +
        '| Guwahati | ~55 m | 35 °C (summer scorcher) |\n' +
        '| Shillong | ~1,500 m | 35 - 6.5 x 1.5 = **25 °C** (pleasant) |\n' +
        '| Tawang | ~3,048 m | 35 - 6.5 x 3 = **15 °C** (jacket weather) |\n' +
        '| Snow leopard habitat | ~4,500 m | 35 - 6.5 x 4.5 = **6 °C** (near freezing) |\n' +
        '| Kangchenjunga summit | ~8,586 m | 35 - 6.5 x 8.5 = **-20 °C** (deadly cold) |\n\n' +
        '**Why being closer to the Sun doesn\'t matter:** The Sun is 150 *million* km away. Whether you\'re at sea level or on Everest, your distance to the Sun changes by only 9 km — a difference of 0.000006%. Completely negligible.\n\n' +
        '| Factor | Effect on mountain temperature |\n' +
        '|--------|-------------------------------|\n' +
        '| Distance from Sun | Negligible (9 km out of 150 million) |\n' +
        '| Distance from warm ground | Major — air cools as it rises |\n' +
        '| Lower air pressure | Major — air expands and cools |\n' +
        '| Thinner air holds less heat | Moderate — fewer molecules to store energy |\n' +
        '| Stronger winds | Moderate — wind chill strips warmth |\n\n' +
        'This is why the snow leopard\'s habitat at 3,000-5,500 m is bitterly cold — not because it\'s closer to the Sun, but because it\'s far above the warm ground and wrapped in thin, expanded air.',
      intermediateContent:
        'The **environmental lapse rate** (ELR) of ~6.5 °C/km is an observed average, not a physical constant. The physics gives us two theoretical rates:\n\n' +
        '| Lapse rate | Symbol | Value | Condition | Formula |\n' +
        '|-----------|--------|-------|-----------|---------|\n' +
        '| Dry adiabatic (DALR) | Γ_d | **9.8 °C/km** | Dry air rising | g/c_p = 9.81/1005 |\n' +
        '| Saturated adiabatic (SALR) | Γ_s | **4-7 °C/km** | Moist air condensing | Varies with T, humidity |\n' +
        '| Environmental (ELR) | Γ | **~6.5 °C/km** | Observed average | Between DALR and SALR |\n\n' +
        '**Why the difference?** When moist air rises and cools to its dew point, water vapour condenses and releases latent heat (L_v = 2.26 x 10⁶ J/kg), *warming the parcel from within*. This slows the cooling rate. The ELR falls between DALR and SALR because real air is partially moist.\n\n' +
        '**Worked example — Shillong temperature prediction:**\n\n' +
        '| Step | Calculation |\n' +
        '|------|-------------|\n' +
        '| Guwahati temp | T₀ = 30 °C at ~55 m |\n' +
        '| Altitude difference | Δh = 1,500 - 55 = 1,445 m ≈ 1.45 km |\n' +
        '| Using ELR (6.5 °C/km) | ΔT = 6.5 x 1.45 = 9.4 °C |\n' +
        '| Predicted Shillong temp | 30 - 9.4 = **20.6 °C** |\n' +
        '| Actual average (April) | ~19-21 °C ✓ |\n\n' +
        'The ELR prediction matches reality well — this is why Shillong was a British hill station. The 1,500 m elevation drop gives roughly 10 °C of cooling, turning a sweltering Brahmaputra plain day into a pleasant highland afternoon.',
      advancedContent:
        'Atmospheric stability depends on the relationship between the ELR and the parcel lapse rates:\n\n' +
        '| Condition | Relationship | Stability | What happens |\n' +
        '|-----------|-------------|-----------|-------------|\n' +
        '| **Absolutely unstable** | ELR > DALR (>9.8 °C/km) | Unstable | Any displaced parcel accelerates away — vigorous convection |\n' +
        '| **Conditionally unstable** | SALR < ELR < DALR | Depends on moisture | Stable if dry, unstable once saturated |\n' +
        '| **Absolutely stable** | ELR < SALR (<4 °C/km) | Stable | Displaced parcels return to origin — no convection |\n\n' +
        'The **conditional instability** regime drives cumulonimbus development: air forced upward by orography or fronts initially resists, but once saturated, accelerates violently.\n\n' +
        '**The Brunt-Vaisala frequency** quantifies stability:\n\n' +
        'N = sqrt((g/θ)(dθ/dz))\n\n' +
        'where θ is potential temperature.\n\n' +
        '| N² value | Meaning | Atmospheric behaviour |\n' +
        '|----------|---------|----------------------|\n' +
        '| N² > 0 | Stable | Gravity waves (oscillations) |\n' +
        '| N² = 0 | Neutral | No restoring force |\n' +
        '| N² < 0 | Unstable | Convective instability |\n\n' +
        '**NE India application:** Typical N ≈ 0.01 s⁻¹ in the Brahmaputra Valley. Mountain-generated gravity waves with this frequency propagate into the stratosphere, depositing momentum and influencing the quasi-biennial oscillation (QBO). The pre-monsoon thunderstorms (nor\'westers) over Assam are classic conditional instability events — dry air aloft overlying moist surface air from the Brahmaputra.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Mountains are cold because they are closer to the Sun, which somehow makes them colder.', answer: false, explanation: 'The Sun is 150 million km away — a few extra km makes no difference. Mountains are cold because air pressure drops with altitude, causing air to expand and cool.' },
            { text: 'Temperature drops about 6.5 degrees C for every 1,000 metres of altitude gain.', answer: true, explanation: 'This is the environmental lapse rate in the troposphere, the layer where weather occurs.' },
            { text: 'The ground absorbs sunlight and warms the air near it — air higher up is farther from this heat source.', answer: true, explanation: 'This is one of the main reasons why temperature decreases with altitude in the troposphere.' },
          ],
        },
      },
    },

    // ── Section 5: Wind and Mountain Weather ───────────────────
    {
      title: 'Wind and Mountain Weather',
      diagram: 'OrographicRainDiagram',
      beginnerContent:
        'Mountains don\'t just sit passively in the weather — they *create* weather. When wind hits a mountain, it is forced upward. As the air rises, it cools (lapse rate) and moisture condenses into clouds and rain.\n\n' +
        '**The rain shadow effect:**\n\n' +
        '| Side of mountain | What happens | Result |\n' +
        '|-----------------|-------------|--------|\n' +
        '| **Windward** (facing the wind) | Air rises → cools → moisture condenses → rain | Lush, green, wet |\n' +
        '| **Leeward** (behind the mountain) | Air descends → warms → moisture evaporates | Dry, brown, arid |\n\n' +
        'The Himalayas create one of the most dramatic rain shadows on Earth:\n\n' +
        '| Location | Side | Annual rainfall |\n' +
        '|----------|------|-----------------|\n' +
        '| Cherrapunji, Meghalaya | Windward (faces monsoon) | **11,777 mm** (one of wettest on Earth) |\n' +
        '| Mawsynram, Meghalaya | Windward (faces monsoon) | **11,871 mm** (wettest on Earth) |\n' +
        '| Lhasa, Tibet | Leeward (behind Himalayas) | **427 mm** (dry plateau) |\n' +
        '| Turtuk, Ladakh | Leeward (behind Karakoram) | **100 mm** (cold desert) |\n\n' +
        '**Meghalaya connection:** Cherrapunji and Mawsynram sit on the southern edge of the Khasi Hills plateau. Monsoon winds from the Bay of Bengal carry enormous moisture northward. When they hit the abrupt 1,500 m escarpment, the air is forced *sharply* upward, squeezing out extraordinary amounts of rain. The name "Meghalaya" means "abode of clouds" — and the clouds are there because of orographic lifting.\n\n' +
        '| NE India weather phenomenon | Mountain effect causing it |\n' +
        '|---------------------------|---------------------------|\n' +
        '| Cherrapunji\'s extreme rain | Orographic lifting of monsoon air |\n' +
        '| Rain shadow in upper Assam valleys | Mountains block moisture on some sides |\n' +
        '| Morning fog in Brahmaputra Valley | Cold katabatic winds from hills meet warm river air |\n' +
        '| Hailstorms in spring | Unstable conditionally moist air forced up by terrain |',
      intermediateContent:
        '**Orographic rainfall estimation:**\n\n' +
        'Moisture flux F = ρ x q x V x sin(α), where:\n\n' +
        '| Parameter | Symbol | Cherrapunji value | Unit |\n' +
        '|-----------|--------|-------------------|------|\n' +
        '| Air density | ρ | ~1.1 | kg/m³ |\n' +
        '| Specific humidity | q | ~18 | g/kg |\n' +
        '| Wind speed | V | ~15 | m/s |\n' +
        '| Mountain slope angle | α | ~20° | degrees |\n\n' +
        '**Lifting Condensation Level (LCL)** — the altitude where clouds form:\n\n' +
        'z_LCL ≈ 125 x (T - T_dew) metres\n\n' +
        '| Example | T (°C) | T_dew (°C) | z_LCL (m) | Meaning |\n' +
        '|---------|--------|-----------|-----------|----------|\n' +
        '| Humid monsoon day | 30 | 26 | 125 x 4 = **500 m** | Clouds form very low |\n' +
        '| Dry winter day | 20 | 5 | 125 x 15 = **1,875 m** | Clouds form much higher |\n' +
        '| Saturated air | 25 | 25 | 125 x 0 = **0 m** | Fog at ground level |\n\n' +
        '**The Fohn effect** (warm dry wind on leeward side):\n\n' +
        'Air releases latent heat while rising (cools at SALR ~5 °C/km) but warms at DALR (9.8 °C/km) while descending.\n\n' +
        '| Stage | Over a 3,000 m mountain |\n' +
        '|-------|--------------------------|\n' +
        '| Windward ascent (saturated) | Cools at 5 °C/km x 3 km = **-15 °C** |\n' +
        '| Leeward descent (dry, rain left behind) | Warms at 9.8 °C/km x 3 km = **+29.4 °C** |\n' +
        '| Net warming vs windward base | 29.4 - 15 = **+14.4 °C** |\n\n' +
        'This is why leeward valleys can be dramatically warmer than windward slopes at the same altitude.',
      advancedContent:
        'Mountain meteorology involves **mountain-valley wind systems** driven by differential heating:\n\n' +
        '| Wind type | When | Direction | Speed | Cause |\n' +
        '|-----------|------|-----------|-------|-------|\n' +
        '| **Anabatic** | Daytime | Upslope | 1-5 m/s | Slopes heat faster than free atmosphere |\n' +
        '| **Katabatic** | Nighttime | Downslope | 5-30+ m/s | Radiative cooling creates dense cold air |\n' +
        '| **Valley breeze** | Daytime | Up-valley | 2-8 m/s | Valley floor heats, air rises |\n' +
        '| **Mountain breeze** | Nighttime | Down-valley | 2-10 m/s | Cold air pools and drains |\n\n' +
        'The **Froude number** Fr = U/(NH) determines flow regime around mountains:\n\n' +
        '| Fr value | Flow regime | Description |\n' +
        '|----------|------------|-------------|\n' +
        '| Fr > 1 | Flow over | Lee waves, possible rotor turbulence |\n' +
        '| Fr ≈ 1 | Transition | Flow splitting, partial blocking |\n' +
        '| Fr < 1 | Flow blocked | Diverted around the barrier |\n\n' +
        '**Himalayan application:** H ≈ 5-8 km, N ≈ 0.01 s⁻¹, U ≈ 10 m/s → Fr ≈ 0.1-0.2 (strongly blocked). The monsoon flow cannot go *over* the Himalayas — it is deflected *around* them. The Brahmaputra Valley acts as a funnel channelling moisture into NE India, which is why:\n\n' +
        '| Consequence of Himalayan blocking | Mechanism |\n' +
        '|----------------------------------|----------|\n' +
        '| Meghalaya extreme rainfall | Moisture funnelled into Khasi Hills escarpment |\n' +
        '| Brahmaputra Valley floods | Channelled moisture + orographic rain + snowmelt |\n' +
        '| Tibetan Plateau aridity | Moisture blocked before reaching Tibet |\n' +
        '| NE India biodiversity hotspot | Extreme moisture gradient creates diverse habitats |',
    },

    // ── Section 6: Animal Adaptations ──────────────────────────
    {
      title: 'How Animals Adapt to High Altitude',
      beginnerContent:
        'Life at high altitude is brutal: less oxygen, extreme cold, intense UV, and fierce winds. Yet animals thrive there — because evolution has given them remarkable tools.\n\n' +
        '**Snow leopard adaptations:**\n\n' +
        '| Adaptation | What it does | Why it matters at altitude |\n' +
        '|-----------|-------------|---------------------------|\n' +
        '| Large nasal cavities | Warm and humidify thin, cold air | Prevents lung damage from freezing air |\n' +
        '| Wide, fur-covered paws | Distribute weight like snowshoes | Walk on snow without sinking |\n' +
        '| Exceptionally long, thick tail | Balance on steep terrain + face wrap during sleep | Multi-tool for survival |\n' +
        '| Modified haemoglobin | Binds oxygen more tightly | Extracts more O₂ from thin air |\n' +
        '| Thick, dense fur | Insulation against -30 °C winds | 5 cm on back, 12 cm on belly |\n' +
        '| Grey-white colouring | Camouflage against rock and snow | Ambush predator needs invisibility |\n\n' +
        '**Human adaptations — Sherpas and Tibetans:**\n\n' +
        'Himalayan people like Sherpas have *genetic* adaptations — not just acclimatisation. After thousands of years at altitude, their DNA has changed:\n\n' +
        '| Adaptation | Sherpas | Lowlanders at altitude |\n' +
        '|-----------|---------|------------------------|\n' +
        '| Red blood cell production | Normal (controlled by EPAS1 gene) | Overproduction → thick, dangerous blood |\n' +
        '| Blood vessel dilation | Excellent | Poor — vasoconstriction |\n' +
        '| Oxygen extraction by muscles | Highly efficient | Inefficient |\n' +
        '| Risk of altitude sickness | Very low | High without acclimatisation |\n\n' +
        'The Monpa people of Tawang (Arunachal Pradesh), living at ~3,000 m for centuries, show some of the same adaptations as Tibetans — not surprising, given their shared Tibetan ancestry.',
      intermediateContent:
        '**Oxygen delivery — the haemoglobin dissociation curve:**\n\n' +
        'The S-shaped curve of blood O₂ saturation (SpO₂) vs partial pressure (pO₂):\n\n' +
        '| Altitude | pO₂ in lungs (kPa) | SpO₂ (%) | Effect on performance |\n' +
        '|----------|-------------------|----------|----------------------|\n' +
        '| Sea level | 13.3 | ~98% | Full capacity |\n' +
        '| 3,000 m | 9.5 | ~93% | 5-10% performance loss |\n' +
        '| 5,500 m | 6.8 | ~85% | Severe impairment |\n' +
        '| 7,000 m | 5.5 | ~70% | "Death zone" for unacclimatised |\n\n' +
        'High-altitude animals shift this curve **leftward** — their haemoglobin grabs O₂ more tightly at low pressures.\n\n' +
        '| Species | P₅₀ (kPa) | Compared to lowland cats | Advantage |\n' +
        '|---------|----------|-------------------------|----------|\n' +
        '| Lowland cat | 3.6 | Baseline | Normal O₂ binding |\n' +
        '| Snow leopard | 3.0 | 17% lower | Binds O₂ more tightly at low pO₂ |\n' +
        '| Bar-headed goose | 2.8 | — | Flies over Himalayas at 9,000 m |\n\n' +
        '**UV radiation at altitude:**\n\n' +
        '| Altitude | UV-B increase vs sea level | UV index (typical) |\n' +
        '|----------|--------------------------|--------------------|\n' +
        '| Sea level | Baseline | 6-8 (India plains) |\n' +
        '| 2,000 m | +20-24% | 8-10 |\n' +
        '| 4,000 m | +40-50% | 11-13 |\n' +
        '| Tibetan Plateau (5,000 m) | +50-60% | **15+** |\n\n' +
        'UV intensity increases ~10-12% per 1,000 m because there is less atmosphere to absorb it. Snow reflection doubles the dose — snow leopards\' fur pigmentation protects their skin.',
      advancedContent:
        'High-altitude adaptation is a textbook case of **convergent evolution** — three human populations found three different solutions:\n\n' +
        '| Population | Altitude (generations) | Key adaptation | Genetic mechanism |\n' +
        '|-----------|----------------------|----------------|-------------------|\n' +
        '| **Tibetans** | ~25,000 years | Suppress excess red blood cells | EPAS1 allele (from Denisovan introgression) |\n' +
        '| **Andeans** | ~11,000 years | Elevated haemoglobin + wider vessels | Multiple loci, barrel chest |\n' +
        '| **Ethiopians** | ~5,000 years | Neither elevated Hb nor modified EPAS1 | Unknown — different pathway entirely |\n\n' +
        'The Tibetan **EPAS1** allele encodes HIF-2α, a hypoxia-inducible transcription factor. It was inherited from Denisovan hominins via introgression ~40,000 years ago — one of the clearest examples of **adaptive introgression** in human evolution.\n\n' +
        '**Snow leopard genomics:**\n\n' +
        '| Gene | Function | Mutation effect |\n' +
        '|------|----------|----------------|\n' +
        '| **EGLN1** | Oxygen sensing (PHD2 enzyme) | Reduces HIF degradation under hypoxia |\n' +
        '| **HBB** | β-globin (haemoglobin subunit) | Single amino acid change → higher O₂ affinity |\n' +
        '| **EPAS1** | HIF-2α transcription factor | Modulates erythropoiesis response |\n\n' +
        '**The oxygen cascade** from atmosphere to mitochondria:\n\n' +
        '| Step | Process | Limiting factor at altitude |\n' +
        '|------|---------|---------------------------|\n' +
        '| 1. Ventilation | Air → alveoli | Reduced pO₂ in inspired air |\n' +
        '| 2. Diffusion | Alveoli → blood | Fick\'s law: J = D x A x (ΔP/Δx) |\n' +
        '| 3. Circulation | Blood → tissues | Cardiac output, Hb concentration |\n' +
        '| 4. Cellular extraction | Blood → mitochondria | Myoglobin, mitochondrial density |\n\n' +
        'High-altitude lungs compensate with larger alveolar surface area (A) and thinner diffusion barrier (Δx), as predicted by Fick\'s law.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'At the summit of Mount Everest (8,849 m), atmospheric pressure is about one-third of sea level. Water boils at only 70 °C instead of 100 °C — you cannot make a proper cup of tea up there.',
            'At sea level, the air above you weighs about 10 tonnes per square metre. On a 4,000 m mountaintop, that drops to roughly 6 tonnes — a 40% reduction.',
            'La Rinconada in Peru, at 5,100 m, is the highest permanent human settlement on Earth. Residents\' blood contains up to 50% more red blood cells than lowlanders to compensate for the thin air.',
            'The stratosphere (12-50 km) is home to the ozone layer, which absorbs 97-99% of the Sun\'s harmful ultraviolet radiation. Without it, life on land would be virtually impossible.',
          ],
        },
      },
    },

    // ── Section 7: The Treeline ────────────────────────────────
    {
      title: 'The Treeline — Where Trees Give Up',
      diagram: 'ClimateZonesDiagram',
      beginnerContent:
        'As you climb a mountain, forests thin and eventually *stop* at a boundary called the **treeline** (or timberline). Above this line, no trees grow — only low shrubs, grasses, mosses, and lichens.\n\n' +
        '**Why do trees give up?** It\'s not one thing — it\'s everything hitting at once:\n\n' +
        '| Hostile factor | What it does to trees |\n' +
        '|---------------|----------------------|\n' +
        '| Low temperature | Below ~6.7 °C mean warmest month, wood cannot form |\n' +
        '| Fierce winds | Desiccate leaves, snap branches, sandblast bark |\n' +
        '| Thin soil | Often just centimetres over rock — roots can\'t anchor |\n' +
        '| Intense UV | Damages plant cells and DNA |\n' +
        '| Short growing season | Not enough warm days to complete growth cycle |\n' +
        '| Heavy snow/ice | Crushes branches, buries seedlings for months |\n\n' +
        '**Treeline altitudes around the world:**\n\n' +
        '| Region | Treeline altitude | Why |\n' +
        '|--------|------------------|-----|\n' +
        '| Central Himalayas | ~4,200 m | Mass elevation effect warms interior ranges |\n' +
        '| NE India (Arunachal) | ~3,500 m | Cooler, more exposed, maritime influence |\n' +
        '| European Alps | ~2,300 m | Higher latitude = colder at same altitude |\n' +
        '| Arctic Norway | ~300 m | Near-polar latitude |\n' +
        '| Equatorial Andes | ~4,500 m | Warm tropics push treeline highest |\n\n' +
        'Near the treeline, trees grow in twisted, stunted forms called **krummholz** (German for "crooked wood") — they survive only where rocks or snowdrifts shelter them from wind.\n\n' +
        '**Snow leopard connection:** The snow leopard\'s range (3,000-5,500 m) straddles the treeline. Below it, they use rocky outcrops and sparse forest for ambush cover. Above it, they rely on open alpine terrain where grey-white fur provides camouflage against rock and snow. The treeline isn\'t just a botanical boundary — it separates two entirely different ecosystems.',
      intermediateContent:
        'The treeline correlates remarkably well with the **6.7 °C mean warmest-month isotherm** worldwide.\n\n' +
        '**Worked example — predicting treeline altitude:**\n\n' +
        '| Location | Summer sea-level T (°C) | Treeline = (T - 6.7) / 6.5 km | Predicted (m) | Actual (m) |\n' +
        '|----------|------------------------|-------------------------------|--------------|------------|\n' +
        '| Central Himalayas | 34 | (34-6.7)/6.5 = 4.2 km | 4,200 | ~4,200 ✓ |\n' +
        '| Arunachal Pradesh | 30 | (30-6.7)/6.5 = 3.6 km | 3,600 | ~3,500 ✓ |\n' +
        '| Arctic Norway | 10 | (10-6.7)/6.5 = 0.5 km | 500 | ~300 (close) |\n\n' +
        'The formula works because the same lapse rate (~6.5 °C/km) applies everywhere in the troposphere.\n\n' +
        '**Wind chill at the treeline:**\n\n' +
        'T_wc = 13.12 + 0.6215T - 11.37V^0.16 + 0.3965TV^0.16 (V in km/h)\n\n' +
        '| Air temp (°C) | Wind (km/h) | Wind chill (°C) | Survival time (exposed skin) |\n' +
        '|--------------|------------|-----------------|-----------------------------|\n' +
        '| -5 | 20 | -11.0 | Hours |\n' +
        '| -5 | 40 | -14.6 | 1-2 hours |\n' +
        '| -10 | 40 | -21.1 | 30-60 minutes |\n' +
        '| -20 | 60 | -36.2 | 10-15 minutes (frostbite risk) |\n\n' +
        'At these wind chills, trees lose water through stomata faster than roots can replace it — desiccation death, not freezing, is often what kills trees at the treeline.',
      advancedContent:
        'Treeline dynamics are a sensitive **bioindicator of climate change**.\n\n' +
        '| Treeline driver | Effect | Rate of change |\n' +
        '|----------------|--------|----------------|\n' +
        '| Temperature warming | Treeline advances upslope | 0.5-2.0 m/year (global average) |\n' +
        '| Recruitment limitation | Seed dispersal into alpine zones | Delays advance by decades |\n' +
        '| Facilitation requirement | Seedlings need nurse rocks/shrubs | Patchy, non-uniform advance |\n' +
        '| Geomorphological constraints | Rockfall, avalanches, permafrost | Blocks advance entirely in some areas |\n\n' +
        'The **mass elevation effect** explains why treelines in the interior of large mountain ranges are *higher* than on isolated peaks at the same latitude:\n\n' +
        '| Range | Treeline (m) | Mass elevation effect |\n' +
        '|-------|-------------|----------------------|\n' +
        '| Central Himalayas (interior) | ~4,200 | Strong — Tibetan Plateau heats air mass |\n' +
        '| NE India (Arunachal, peripheral) | ~3,500 | Weak — isolated ranges, maritime cooling |\n' +
        '| Japanese Alps (isolated) | ~2,500 | Minimal — island mountains |\n\n' +
        '**Climate projections (Himalayan treeline under RCP 8.5):**\n\n' +
        '| Timeframe | Projected upslope shift | Consequence |\n' +
        '|-----------|----------------------|-------------|\n' +
        '| By 2050 | +100-300 m | Alpine zone compressed |\n' +
        '| By 2100 | +200-600 m | Endemic alpine species lose habitat |\n' +
        '| Snow leopard impact | Prey habitat shifts upward | Hunting range squeezed toward summits |\n\n' +
        'Modelling uses **dynamic vegetation models** (DVMs) coupling carbon assimilation (Farquhar photosynthesis model), water balance, and demographic processes. The snow leopard\'s future depends on how fast the treeline chases the alpine zone uphill.',
    },

    // ── Section 8: Human Acclimatization ───────────────────────
    {
      title: 'Human Acclimatization',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'At 3,500 metres, each breath contains about 60% of the oxygen available at sea level.', answer: true, explanation: 'Lower air pressure means fewer oxygen molecules per breath, triggering the body\'s acclimatization response.' },
            { text: 'Sherpas produce extra red blood cells at altitude, just like visiting lowlanders do.', answer: false, explanation: 'Sherpas carry a gene variant (EPAS1, inherited from Denisovans) that prevents overproduction of red blood cells, avoiding dangerously thick blood.' },
            { text: 'Climbing too fast can cause fatal fluid buildup in the lungs or brain.', answer: true, explanation: 'High-altitude pulmonary edema and cerebral edema are both potentially fatal, which is why Everest climbers acclimatize slowly.' },
          ],
        },
      },
      beginnerContent:
        'When a lowlander travels to high altitude, their body faces an oxygen crisis. The body responds with a cascade of adaptations called **acclimatization**.\n\n' +
        '**The acclimatization timeline:**\n\n' +
        '| Timeframe | What happens | Mechanism |\n' +
        '|-----------|-------------|----------|\n' +
        '| Minutes | Breathing rate increases | Carotid body detects low O₂ |\n' +
        '| Hours | Heart rate rises | More blood pumped per minute |\n' +
        '| 1-2 days | Kidneys release EPO hormone | Signals bone marrow to make red blood cells |\n' +
        '| 4-7 days | New red blood cells appear | More haemoglobin to carry oxygen |\n' +
        '| 2-3 weeks | Red blood cell count up 30-50% | Blood carries significantly more O₂ |\n' +
        '| Months | Lung blood vessels widen | Better gas exchange in lungs |\n' +
        '| Months | More mitochondria in cells | Better oxygen extraction at cellular level |\n\n' +
        '**But acclimatization has limits.** Climb too fast and the body can\'t keep pace:\n\n' +
        '| Condition | What happens | How dangerous |\n' +
        '|-----------|-------------|---------------|\n' +
        '| **AMS** (Acute Mountain Sickness) | Headache, nausea, dizziness | Uncomfortable but manageable |\n' +
        '| **HAPE** (High-Altitude Pulmonary Edema) | Fluid leaks into lungs | **Fatal if untreated** — descend immediately |\n' +
        '| **HACE** (High-Altitude Cerebral Edema) | Fluid leaks into brain | **Fatal within hours** — descend immediately |\n\n' +
        'This is why Everest expeditions spend weeks at progressively higher camps, following the golden rule: **climb high, sleep low**.\n\n' +
        '**Assam-to-Tawang example:** A family driving from Guwahati (55 m) to Tawang (3,048 m) in one day gains 3,000 m of altitude in ~12 hours. The Indian Army recommends breaking the journey with a night at Dirang (1,500 m) or Bomdila (2,400 m) to let the body begin adjusting.\n\n' +
        '| Safe ascent guidelines | Rule |\n' +
        '|----------------------|------|\n' +
        '| Above 2,500 m | Gain no more than 500 m sleeping altitude per day |\n' +
        '| Every 1,000 m gained | Take a rest day |\n' +
        '| If symptoms appear | Do NOT ascend further until symptoms resolve |\n' +
        '| If symptoms worsen | Descend immediately — altitude sickness can kill |\n\n' +
        '**Sherpas vs lowlanders:** Sherpa people carry a variant of the EPAS1 gene (inherited from ancient Denisovan ancestors) that prevents overproduction of red blood cells. Their blood stays thin and flows freely, while a lowlander\'s blood thickens dangerously. The snow leopard\'s haemoglobin tells a parallel story — a single amino acid change increases oxygen affinity, allowing the cat to thrive in the same thin air that leaves lowland predators gasping.',
      intermediateContent:
        'The body\'s **hypoxic ventilatory response** (HVR) is the first defence.\n\n' +
        '**Worked example — respiratory changes at 4,000 m:**\n\n' +
        '| Parameter | Sea level | 4,000 m | Change |\n' +
        '|-----------|-----------|---------|--------|\n' +
        '| Resting ventilation | ~6 L/min | ~8.4 L/min | +40% |\n' +
        '| Alveolar pCO₂ | ~5.3 kPa | ~3.5 kPa | -34% (blown off) |\n' +
        '| Blood pH | 7.40 | ~7.47 | Respiratory alkalosis |\n' +
        '| Kidney HCO₃⁻ excretion | Normal | Increased | Corrects alkalosis over 2-3 days |\n\n' +
        '**Red blood cell response:**\n\n' +
        '| Timeframe | EPO level | Haematocrit | New RBC production |\n' +
        '|-----------|----------|------------|--------------------|\n' +
        '| Day 0 (arrival) | Baseline | ~45% | Normal |\n' +
        '| Day 1-2 | **Peak** (2-3x baseline) | ~45% | Stimulated |\n' +
        '| Day 4-7 | Declining | ~48% | New cells appearing |\n' +
        '| Week 3 | Near baseline | ~55% | Plateau |\n\n' +
        '**Pharmacological aids:**\n\n' +
        '| Drug | Mechanism | Use |\n' +
        '|------|-----------|-----|\n' +
        '| **Acetazolamide** (Diamox) | Inhibits carbonic anhydrase → promotes HCO₃⁻ excretion | Speeds acclimatization |\n' +
        '| **Dexamethasone** | Reduces brain inflammation | Emergency treatment for HACE |\n' +
        '| **Nifedipine** | Calcium channel blocker → relaxes pulmonary vessels | Emergency treatment for HAPE |\n' +
        '| **Supplemental O₂** | Directly increases inspired pO₂ | Above 7,000 m on Everest |',
      advancedContent:
        'The **HIF (Hypoxia-Inducible Factor)** pathway is the master regulator of cellular oxygen sensing — the discovery won Semenza, Ratcliffe, and Kaelin the 2019 Nobel Prize.\n\n' +
        '**HIF pathway under normoxia vs hypoxia:**\n\n' +
        '| Condition | PHD enzyme activity | HIF-1α status | Half-life | Gene activation |\n' +
        '|-----------|-------------------|--------------|-----------|------------------|\n' +
        '| **Normoxia** | Active (uses O₂) | Hydroxylated → VHL ubiquitinates → proteasome degrades | ~5 min | OFF |\n' +
        '| **Hypoxia** | Inactive (no O₂ substrate) | Accumulates → dimerises with HIF-1β | Hours | ON (>100 target genes) |\n\n' +
        '**Key HIF target genes:**\n\n' +
        '| Gene | Product | Function at altitude |\n' +
        '|------|---------|---------------------|\n' +
        '| **EPO** | Erythropoietin | Stimulates red blood cell production |\n' +
        '| **VEGF** | Vascular endothelial growth factor | New blood vessel formation |\n' +
        '| **GLUT1** | Glucose transporter 1 | Increased glucose uptake |\n' +
        '| **Glycolytic enzymes** | HK, PFK, LDH | Shift metabolism toward anaerobic glycolysis |\n\n' +
        'The Tibetan EPAS1 variant modifies HIF-2α, reducing its transcriptional activation of EPO — preventing dangerous polycythaemia.\n\n' +
        '**HAPE mechanism — the vasoconstriction cascade:**\n\n' +
        '| Step | Event | Consequence |\n' +
        '|------|-------|-------------|\n' +
        '| 1 | Alveolar hypoxia | O₂ drops in lung air sacs |\n' +
        '| 2 | K⁺ channel inhibition | Voltage-gated K⁺ channels in pulmonary artery smooth muscle close |\n' +
        '| 3 | Membrane depolarisation | Loss of K⁺ efflux → positive charge builds |\n' +
        '| 4 | Ca²⁺ influx | Voltage-gated Ca²⁺ channels open |\n' +
        '| 5 | Vasoconstriction | Smooth muscle contracts → pulmonary artery pressure rises |\n' +
        '| 6 | Fluid leak | High pressure forces plasma into alveoli → HAPE |\n\n' +
        'Nifedipine (a calcium channel blocker) directly counteracts step 4, which is why it is the emergency drug of choice for HAPE.',
    },
  ]
};
