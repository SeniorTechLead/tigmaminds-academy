import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'solar-system-and-space',
  title: 'The Solar System & Space',
  category: 'astronomy',
  icon: '🪐',
  tagline: 'Eight planets, one star, and billions of mysteries — our cosmic neighborhood.',
  relatedStories: ['stars-ziro-valley', 'star-fell-deepor'],
  understand: [
    {
      title: 'The Sun — Our Star',
      beginnerContent:
        'At the center of our solar system sits a middle-aged, medium-sized star we call the Sun. It is a massive ball of hydrogen and helium gas roughly 1.39 million kilometres in diameter — about 109 times the diameter of Earth. Deep in its core, where temperatures reach about 15 million degrees Celsius and pressures are 250 billion times the atmospheric pressure at Earth\'s surface, hydrogen nuclei fuse together to form helium through a process called **nuclear fusion**. Every second, the Sun converts approximately 600 million tonnes of hydrogen into helium, releasing energy equivalent to detonating 90 billion one-megaton nuclear bombs. A tiny fraction of that energy — about one two-billionth — reaches Earth, and it is enough to power every weather system, every ocean current, and nearly every living organism on the planet.\n\nThe Sun also emits a constant stream of charged particles called the **solar wind**, flowing outward at 400–800 km/s. This wind shapes a vast bubble called the heliosphere that extends far beyond the orbit of Pluto. When especially energetic bursts of solar wind — called coronal mass ejections — slam into Earth\'s magnetic field, they create the shimmering aurora borealis and aurora australis. The Sun is about 4.6 billion years old and is roughly halfway through its expected lifespan. In about 5 billion years, it will exhaust its hydrogen fuel, swell into a red giant engulfing Mercury and Venus, then collapse into a white dwarf no larger than Earth.',
      intermediateContent:
        'The Sun’s energy comes from the **proton–proton chain**: four hydrogen nuclei fuse into one helium-4 nucleus, releasing 26.7 MeV per reaction. The mass defect (Δm = 4×1.0078 − 4.0026 = 0.0287 u) is converted to energy via **E = mc²**: 0.0287 × 931.5 MeV/u = 26.7 MeV. The Sun’s luminosity is **L☉ = 3.828 × 10²⁶ W**. At Earth’s distance (1 AU = 1.496 × 10¹¹ m), the **solar constant** is L☉/(4πr²) = 1,361 W/m². The Sun’s spectral type is **G2V** (main-sequence yellow dwarf), with effective temperature 5,778 K. Its spectrum peaks at 502 nm (green) per Wien’s law, though the integrated output appears white. Solar neutrinos (produced during fusion) pass through the Earth at 65 billion per cm² per second, and their detection confirmed the nuclear fusion model of stellar energy.',
      advancedContent:
        'Stellar structure is modelled by four coupled differential equations: **hydrostatic equilibrium** (pressure gradient balances gravity), **mass continuity** (mass increases with radius), **energy generation** (luminosity increases where fusion occurs), and **energy transport** (radiative in the interior, convective in the outer 30%). The **Hertzsprung–Russell diagram** plots stars by luminosity versus temperature, revealing the main sequence (hydrogen fusion), red giants (helium-shell burning), and white dwarfs (degenerate endpoints). **Stellar nucleosynthesis** builds elements up to iron in massive stars; elements heavier than iron are forged in supernovae (r-process) and neutron star mergers (confirmed by LIGO’s detection of gravitational waves from GW170817 in 2017, accompanied by a kilonova rich in heavy elements). **Exoplanet detection** via the transit method (Kepler, TESS missions) has discovered over 5,500 confirmed exoplanets, with JWST now characterising their atmospheres — searching for biosignature gases like O₂, CH₄, and H₂O.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'The Sun loses about 4 million tonnes of mass every second through nuclear fusion — yet it is so massive that it has barely lost 0.03% of its mass over 4.6 billion years.',
            'Light from the Sun takes about 8 minutes and 20 seconds to reach Earth, traveling 150 million kilometres at 300,000 km/s.',
            'The Sun\'s surface temperature is about 5,500°C, but its outer atmosphere (the corona) is mysteriously over 1 million°C — scientists still debate why.',
          ],
        },
      },
    },
    {
      title: 'The Inner Planets — Mercury, Venus, Earth, Mars',
      diagram: 'OrbitalMechanicsDiagram',
      beginnerContent:
        'The four planets closest to the Sun — Mercury, Venus, Earth, and Mars — are called the **terrestrial** or **rocky** planets. They share common features: solid surfaces, iron-rich cores, relatively thin or no atmospheres (compared to the gas giants), and fewer moons. Despite these similarities, each is dramatically different.\n\n**Mercury** is the smallest planet (4,880 km diameter) and the closest to the Sun (57.9 million km average distance). With virtually no atmosphere, its surface temperature swings from 430°C in daytime to −180°C at night — the most extreme temperature range of any planet. Its year lasts just 88 Earth days, but a single Mercury day (sunrise to sunrise) lasts 176 Earth days.\n\n**Venus** is nearly Earth\'s twin in size (12,104 km diameter vs Earth\'s 12,742 km) but could hardly be more different in conditions. Its thick atmosphere is 96.5% carbon dioxide, creating a runaway greenhouse effect that heats the surface to 465°C — hotter than Mercury despite being farther from the Sun. Venus rotates backward (retrograde) and so slowly that a Venusian day is longer than its year. Atmospheric pressure at the surface is 92 times that of Earth.\n\n**Earth** orbits at an average distance of 149.6 million km (1 Astronomical Unit, or AU), sitting in the habitable zone where liquid water can exist on the surface. It is the densest planet in the solar system (5.51 g/cm³) and the only one known to support life. **Mars**, the "Red Planet," is about half Earth\'s diameter (6,779 km) with a thin CO₂ atmosphere (surface pressure less than 1% of Earth\'s). Its red color comes from iron oxide dust. Mars has the solar system\'s tallest volcano (Olympus Mons, 21.9 km high) and deepest canyon (Valles Marineris, up to 7 km deep). Evidence of ancient river channels and lake beds suggests Mars once had liquid water on its surface.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each inner planet to its key feature',
          pairs: [
            ['Mercury', 'Smallest planet; most extreme temperature swings (−180°C to 430°C)'],
            ['Venus', 'Runaway greenhouse effect; surface hotter than Mercury at 465°C'],
            ['Earth', 'Only known planet with liquid surface water and life'],
            ['Mars', 'Tallest volcano in the solar system (Olympus Mons, 21.9 km)'],
          ],
        },
      },
    },
    {
      title: 'The Outer Planets — Jupiter, Saturn, Uranus, Neptune',
      beginnerContent:
        'Beyond the asteroid belt lie the four **gas giants** (though Uranus and Neptune are sometimes called **ice giants** because they contain more water, ammonia, and methane ices). These planets are vastly larger than the terrestrial worlds and have deep, thick atmospheres with no solid surface you could stand on.\n\n**Jupiter** is the king of planets — 318 times Earth\'s mass and 11.2 times its diameter (142,984 km). It contains more mass than all other planets combined. Its Great Red Spot is a storm larger than Earth that has raged for at least 350 years. Jupiter has at least 95 known moons, including the four large Galilean moons discovered by Galileo in 1610: volcanic Io, ice-covered Europa (which may harbor a liquid ocean beneath its frozen surface), Ganymede (the largest moon in the solar system, bigger than Mercury), and crater-pocked Callisto.\n\n**Saturn** is famous for its spectacular ring system, made of billions of particles of ice and rock ranging from tiny grains to house-sized boulders. Saturn is the least dense planet — at 0.687 g/cm³, it would float in a bathtub large enough to hold it. Its largest moon, Titan, has a thick nitrogen atmosphere and lakes of liquid methane and ethane on its surface.\n\n**Uranus** rotates on its side (axial tilt of 98°), likely the result of a massive collision early in the solar system\'s history. **Neptune**, the most distant planet at 4.5 billion km from the Sun, has the fastest winds in the solar system — up to 2,100 km/h. Its largest moon, Triton, orbits backward and may be a captured Kuiper Belt object. Neptune takes 165 Earth years to complete one orbit; it only finished its first full orbit since discovery in 2011.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Jupiter has more mass than all other planets in the solar system combined.', answer: true, explanation: 'Jupiter\'s mass is 318 times Earth\'s and exceeds the combined mass of all other planets.' },
            { text: 'Saturn\'s rings are solid sheets of ice.', answer: false, explanation: 'The rings are made of billions of individual particles — ice chunks and rocks — ranging from tiny grains to house-sized boulders.' },
            { text: 'Uranus rotates on its side with an axial tilt of about 98 degrees.', answer: true, explanation: 'This extreme tilt is thought to be caused by a massive collision with an Earth-sized object early in solar system history.' },
            { text: 'Neptune is closer to the Sun than Uranus.', answer: false, explanation: 'Neptune orbits at about 4.5 billion km from the Sun, far beyond Uranus at 2.9 billion km.' },
          ],
        },
      },
    },
    {
      title: 'Moons, Asteroids, and Comets',
      beginnerContent:
        'The solar system is far more than just planets. **Moons** (natural satellites) orbit most planets — our solar system has over 290 known moons. Earth has one (the Moon, 3,474 km diameter, which stabilizes our axial tilt and creates tides), while Jupiter and Saturn have dozens each. Some moons are geologically active: Io has over 400 active volcanoes, Enceladus shoots geysers of water ice into space from a subsurface ocean, and Europa\'s ice-covered ocean is considered one of the most promising places to search for extraterrestrial life.\n\nThe **asteroid belt** between Mars and Jupiter contains millions of rocky bodies left over from the solar system\'s formation. The largest asteroid, Ceres (940 km diameter), is also classified as a dwarf planet. Most asteroids are small and irregularly shaped — the total mass of the entire asteroid belt is only about 4% of the Moon\'s mass.\n\n**Comets** are icy bodies from the outer solar system — the Kuiper Belt (beyond Neptune) and the Oort Cloud (a vast shell extending up to 1.5 light-years from the Sun). When a comet\'s orbit brings it closer to the Sun, solar radiation vaporizes its ices, creating a glowing coma and one or two tails: a dust tail pushed by radiation pressure and an ion tail pushed by the solar wind, always pointing away from the Sun. Famous comets include Halley\'s Comet (visible every 75–76 years, last in 1986, next in 2061) and Comet NEOWISE, which was visible to the naked eye across NE India in July 2020.',
    },
    {
      title: 'Space Exploration — ISRO and India\'s Space Program',
      diagram: 'GravitationalFieldDiagram',
      beginnerContent:
        'India\'s space program, led by the **Indian Space Research Organisation (ISRO)**, is one of the most cost-effective and ambitious in the world. Founded in 1969, ISRO has achieved milestones that took other space agencies decades longer. **Chandrayaan-1** (2008) was India\'s first lunar mission; its Moon Impact Probe confirmed the presence of water molecules on the lunar surface — a discovery that changed our understanding of the Moon. **Chandrayaan-3** (2023) made India the fourth country to soft-land on the Moon and the first to land near the lunar south pole, where the Pragyan rover analyzed soil composition and confirmed the presence of sulfur.\n\n**Mangalyaan** (Mars Orbiter Mission, 2014) made India the first Asian country to reach Mars orbit — and it did so on its first attempt, at a cost of just $74 million (less than the budget of the Hollywood film *Gravity*). The spacecraft studied Mars\'s atmosphere and surface for eight years before losing contact in 2022. ISRO\'s **PSLV** (Polar Satellite Launch Vehicle) has become one of the world\'s most reliable rockets, launching satellites for dozens of countries. In 2017, PSLV set a world record by deploying 104 satellites in a single launch.\n\nISRO\'s upcoming missions include **Gaganyaan**, India\'s first crewed spaceflight program, aiming to send three astronauts to low Earth orbit. The **Aditya-L1** solar observatory, launched in 2023, studies the Sun from the L1 Lagrange point 1.5 million km from Earth. For students in NE India, ISRO\'s achievements are a powerful reminder that world-class science does not require the largest budget — it requires ingenuity, persistence, and rigorous engineering.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each ISRO mission to its achievement',
          pairs: [
            ['Chandrayaan-1 (2008)', 'First Indian lunar mission; confirmed water molecules on the Moon'],
            ['Chandrayaan-3 (2023)', 'First landing near the lunar south pole'],
            ['Mangalyaan (2014)', 'First Asian Mars orbiter; cost just $74 million'],
            ['Aditya-L1 (2023)', 'Solar observatory at the L1 Lagrange point'],
          ],
        },
      },
    },
  ],
};
