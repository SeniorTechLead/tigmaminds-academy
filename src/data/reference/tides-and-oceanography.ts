import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'tides-and-oceanography',
  title: 'Tides & Oceanography',
  category: 'marine-science',
  icon: '🌊',
  tagline: 'Why the ocean breathes with the Moon, waves carry energy but not water, and coral reefs are underwater cities.',
  relatedStories: ['fishermans-storm-shelter', 'river-dolphins-secret', 'parting-red-sea'],
  understand: [
    {
      title: 'Why the Ocean Breathes — The Moon Pulling Water',
      diagram: 'TideMoonDiagram',
      beginnerContent:
        'Twice a day, the ocean rises and falls along coastlines around the world. This rhythmic breathing is caused by the Moon\'s gravity. The Moon pulls on everything on Earth, but it pulls on the water closest to it slightly more than on the solid Earth beneath, because gravitational force decreases with distance. This extra pull stretches the ocean into a bulge on the side facing the Moon — a high tide.\n\nBut there is a second bulge on the opposite side of Earth too, which surprises many people. On the far side, the solid Earth is pulled toward the Moon more than the distant water, effectively leaving the water behind — creating another bulge. So Earth actually has two tidal bulges at any time: one facing the Moon and one facing away. As the Earth rotates on its axis every 24 hours, any given coastline passes through both bulges, producing two high tides and two low tides each day.\n\nThe difference between high tide and low tide (the tidal range) varies enormously. In the Mediterranean Sea, it can be less than 30 centimetres. In Canada\'s Bay of Fundy, the tidal range can exceed 16 metres — enough to cover a four-storey building. The bay\'s funnel shape amplifies the tidal wave as it is squeezed into a narrowing channel.',
      intermediateContent:
        'The tidal force is the **difference** in gravitational pull across Earth’s diameter. The Moon’s gravitational acceleration at Earth’s centre is g_moon = GM_moon/d², where d ≈ 384,400 km. The tidal acceleration Δg ≈ 2GM_moon · R_Earth / d³, yielding about 1.1 × 10⁻⁶ m/s² — tiny compared to Earth’s gravity (9.8 m/s²) but enough to raise ocean bulges of about 0.5 m in open ocean. The Sun’s tidal acceleration is about 46% of the Moon’s (its greater mass is offset by far greater distance). **Tidal harmonics** decompose the complex observed tide into sinusoidal components (M₂ = principal lunar semidiurnal at 12.42 hours, S₂ = principal solar, K₁ = lunisolar diurnal), with amplitudes and phases determined locally by basin geometry. Coastal amplification via resonance can multiply the open-ocean tide by 10× or more, as in the Bay of Fundy.',
      advancedContent:
        'The **Laplace tidal equations** model tides as shallow-water waves in ocean basins, incorporating Earth’s rotation (Coriolis effect), basin geometry, and seafloor friction. Tides rotate around **amphidromic points** — nodal points of zero tidal amplitude where cotidal lines (lines of simultaneous high tide) radiate outward like spokes. The North Sea has three amphidromic points; the Bay of Bengal has one near Sri Lanka. Modern tidal prediction uses satellite altimetry (TOPEX/Poseidon, Jason series) measuring sea-surface height to centimetre precision, feeding global models like FES2014 with over 30 harmonic constituents. **Tidal energy** harvesting uses turbines in high-current channels (e.g., the 240 MW Sihwa Lake plant in South Korea) or oscillating water columns. The Sundarbans tidal channels experience 2–5 m tidal ranges — potentially viable for small-scale tidal stream generators to power remote communities.',
    },
    {
      title: 'Spring Tides and Neap Tides',
      diagram: 'TideSpringNeapDiagram',
      beginnerContent:
        'The Sun also pulls on Earth\'s oceans, but because it is so much further away (despite being far more massive), its tidal effect is only about 46% of the Moon\'s. When the Sun and Moon align — during a new moon or a full moon — their gravitational pulls add together, producing extra-large tides called spring tides (the name has nothing to do with the season — it comes from the old English word "springan," meaning to surge). During spring tides, high tides are higher and low tides are lower than average.\n\nWhen the Sun and Moon are at right angles to each other (during quarter moons), their pulls partially cancel out, producing smaller tides called neap tides. During neap tides, high tides are lower and low tides are higher than average — the tidal range is at its minimum.\n\nFishermen and sailors have tracked this cycle for thousands of years. In coastal Assam and the Sundarbans, fishermen plan their trips around the tidal calendar — strong spring tides mean stronger currents that can be dangerous for small boats, but also bring nutrient-rich water that attracts fish. Understanding tides is not abstract science — it is a matter of livelihood and safety.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each tidal condition to its cause',
          pairs: [
            ['Spring tide (largest tidal range)', 'Sun and Moon aligned — gravitational pulls ADD together (new or full moon)'],
            ['Neap tide (smallest tidal range)', 'Sun and Moon at right angles — gravitational pulls partially CANCEL (quarter moons)'],
            ['Two tides per day', 'Earth rotates through two tidal bulges — one facing Moon, one on opposite side'],
            ['Bay of Fundy\'s extreme 16 m range', 'Funnel-shaped bay amplifies the tidal wave as it squeezes into a narrow channel'],
          ],
        },
      },
    },
    {
      title: 'Ocean Currents — Rivers Inside the Ocean',
      diagram: 'OceanCurrentDiagram',
      beginnerContent:
        'The ocean is not a still body of water — it is crisscrossed by enormous currents that flow like rivers, some warm, some cold, carrying heat and nutrients around the planet. The Gulf Stream, for example, is a warm current that flows from the Gulf of Mexico northeast across the Atlantic. It carries so much heat that it keeps Western Europe significantly warmer than it would otherwise be — London, at the same latitude as Calgary in Canada, rarely sees temperatures below -5°C.\n\nThese currents are driven by two forces: wind (which drives surface currents) and differences in water density (which drives deep currents). Cold water is denser than warm water, and salty water is denser than fresh water. Near the poles, ocean water cools and becomes saltier as ice forms (ice excludes salt), making it very dense. This dense water sinks to the ocean floor and flows toward the equator as a deep, cold current. Meanwhile, warm surface water flows from the equator toward the poles to replace it. This global circulation — called the thermohaline circulation (thermo = heat, haline = salt) — acts like a giant conveyor belt, moving heat from the tropics to the poles and taking about 1,000 years to complete one full cycle. It is one of the most important regulators of Earth\'s climate.',
    },
    {
      title: 'Waves — Energy Traveling, Not Water',
      diagram: 'OceanWaveAnatomyDiagram',
      beginnerContent:
        'Watch a seagull floating on ocean waves. It bobs up and down, rises with each passing wave crest and drops into each trough — but it barely moves horizontally. This reveals a counterintuitive truth: ocean waves transport energy, not water. Each water molecule moves in a roughly circular path, returning almost to its starting position after each wave passes. The wave is a pattern of motion that travels across the surface, like a ripple running through a crowd doing "the wave" at a stadium — the people move up and down, but they stay in their seats.\n\nWaves are born when wind blows across the ocean surface. The wind\'s energy transfers to the water, creating small ripples that grow into larger waves as the wind continues to push. The size of a wave depends on three factors: wind speed, wind duration (how long the wind blows), and fetch (the distance of open water over which the wind blows). This is why the largest ocean waves are found in the Southern Ocean, which circles Antarctica with almost no land to interrupt the wind\'s fetch — waves there can build to over 20 metres.\n\nAs waves approach shore and the water becomes shallower, the bottom of the wave drags on the seabed, slowing it down. The top continues at full speed, causing the wave to steepen and eventually topple forward as a breaking wave — the surf that surfers ride.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Ocean waves carry water from the middle of the ocean to the shore.', answer: false, explanation: 'Waves transport energy, not water. Each water molecule moves in a circular path and ends up roughly where it started.' },
            { text: 'Waves break near shore because the bottom of the wave slows down in shallow water.', answer: true, explanation: 'The bottom drags on the seabed while the top continues at full speed, causing the wave to topple forward.' },
            { text: 'Bigger waves require stronger wind, longer wind duration, and greater fetch.', answer: true, explanation: 'All three factors — wind speed, duration, and fetch (open water distance) — contribute to wave size.' },
          ],
        },
      },
    },
    {
      title: 'Storm Surge — When Wind Pushes the Ocean onto Land',
      diagram: 'OceanStormSurgeDiagram',
      beginnerContent:
        'A storm surge is one of the most dangerous phenomena in nature. During a powerful cyclone or hurricane, the sustained low pressure at the storm\'s center allows the ocean surface to rise (like sucking water up through a straw), and the fierce winds push this raised water toward the coast as a wall of seawater that can be several metres higher than the normal tide. In the 1970 Bhola cyclone in Bangladesh, a storm surge of up to 10 metres flooded low-lying coastal areas, killing an estimated 300,000 to 500,000 people — one of the deadliest natural disasters in recorded history.\n\nStorm surge is not a wave that breaks and retreats — it is a sustained rise in water level that can last for hours, flooding everything in its path. The damage depends on the storm\'s intensity, the shape of the coastline (funnel-shaped bays amplify the surge), the slope of the seabed (gently sloping seabeds push more water onto land), and timing — a storm surge arriving at spring high tide is far more devastating than one arriving at low tide.\n\nCoastal communities in cyclone-prone regions of the Bay of Bengal — including Assam\'s neighboring states — build raised cyclone shelters designed to protect people from storm surges. Understanding the physics of storm surge is literally lifesaving engineering.',
    },
    {
      title: 'The Deep Ocean — Darker Than Space, Crushing Pressure',
      diagram: 'OceanDepthZonesDiagram',
      beginnerContent:
        'The average depth of the ocean is about 3,688 metres — deeper than most people imagine. The deepest point, the Challenger Deep in the Mariana Trench, reaches 10,935 metres below the surface. At that depth, the pressure is over 1,000 atmospheres — roughly the weight of 50 jumbo jets stacked on top of you. Sunlight cannot penetrate beyond about 200 metres, so the vast majority of the ocean floor exists in total, permanent darkness.\n\nYet life thrives there. Deep-sea creatures have evolved extraordinary adaptations: bioluminescent fish that produce their own light (like underwater fireflies), giant squid with the largest eyes in the animal kingdom (to capture every photon in the near-total darkness), and tube worms that live near hydrothermal vents — cracks in the ocean floor where superheated, mineral-rich water gushes out at temperatures above 350°C. These vent communities get their energy not from sunlight but from chemicals dissolved in the vent fluid, through a process called chemosynthesis. They are proof that life can exist without sunlight — a discovery that transformed our search for life on other planets and moons.\n\nWe have explored more of the Moon\'s surface than we have of the deep ocean floor. As of today, only about 20% of the ocean floor has been mapped in high resolution.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'At the bottom of the Mariana Trench, a styrofoam cup would be crushed to the size of a thimble by the pressure.',
            'The deep ocean is so dark that many creatures have lost their eyes entirely — they navigate by touch, smell, and vibration.',
            'Hydrothermal vents were not discovered until 1977. Scientists were astonished to find thriving ecosystems in a place they expected to be lifeless.',
            'If you drained all the water from the ocean, the Mid-Atlantic Ridge would be the longest mountain range on Earth — over 65,000 kilometres long.',
          ],
        },
      },
    },
    {
      title: 'Coral Reefs — Underwater Cities',
      diagram: 'OceanCoralReefDiagram',
      beginnerContent:
        'Coral reefs are the rainforests of the ocean. They cover less than 1% of the ocean floor but support about 25% of all marine species — an astonishing concentration of biodiversity. A coral reef is built by tiny animals called coral polyps, each smaller than your fingernail, that secrete a hard limestone (calcium carbonate) skeleton. Over thousands of years, generations of polyps build on top of each other, creating massive reef structures that can be visible from space. The Great Barrier Reef off Australia stretches over 2,300 kilometres — the largest structure ever built by living organisms.\n\nMost reef-building corals have a partnership with microscopic algae called zooxanthellae that live inside their tissues. The algae photosynthesize (using sunlight to make food), and the coral gets up to 90% of its energy from this arrangement. In return, the coral provides the algae with shelter and nutrients. This is why coral reefs grow only in shallow, clear, warm tropical waters — the algae need sunlight.\n\nWhen water temperatures rise even 1-2°C above normal (due to climate change or El Niño events), the stressed coral expels its algae, turning ghostly white — a phenomenon called coral bleaching. Without the algae, the coral slowly starves. If temperatures return to normal quickly, the algae can recolonize and the coral recovers. If the heat persists, the coral dies. The world has lost about half its coral reef cover since the 1950s, making reef conservation one of the most urgent environmental challenges of our time.',
    },
    {
      title: 'Why the Ocean Matters',
      diagram: 'OceanFunctionsDiagram',
      beginnerContent:
        'The ocean is not just a body of water — it is the engine that drives Earth\'s habitability. It absorbs about 30% of the carbon dioxide humans produce (slowing climate change, but at the cost of ocean acidification). It generates about 50% of the oxygen we breathe (through photosynthesis by phytoplankton — tiny floating algae). It absorbs over 90% of the excess heat from global warming (buffering the atmosphere but warming the water). It drives weather patterns through evaporation and ocean currents. And it provides food for billions of people — fish is the primary source of protein for over 3 billion people worldwide.\n\nThe Brahmaputra River, which flows through Assam, carries 650 million tonnes of sediment into the Bay of Bengal each year — one of the highest sediment loads of any river on Earth. This sediment builds the Sundarbans mangrove delta and fertilizes the coastal ocean, supporting fisheries that feed tens of millions of people. The river, the delta, and the ocean are one connected system — and understanding that connection is the heart of oceanography.\n\nThe ocean covers 71% of Earth\'s surface, yet we know more about the surface of Mars than about the deep ocean floor. Oceanography is one of the great frontiers of science — there are discoveries waiting to be made that we cannot yet even imagine.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each ocean function to its impact',
          pairs: [
            ['Absorbs 30% of human CO2', 'Slows climate change but causes ocean acidification'],
            ['Produces 50% of our oxygen', 'Phytoplankton photosynthesis — tiny floating algae are Earth\'s biggest oxygen factory'],
            ['Absorbs 90% of excess heat', 'Buffers atmospheric warming but raises ocean temperatures'],
            ['Thermohaline circulation', 'Distributes heat from equator to poles, regulating global climate'],
          ],
        },
      },
    },
  ],
};
