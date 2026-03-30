    level0: {
      concepts: [
        {
          title: 'Why the Sky Changes Color',
          paragraphs: [
            'Sunlight is white — a blend of every visible wavelength from red to violet. When this white light enters Earth\'s atmosphere, it collides with gas molecules (mostly nitrogen and oxygen). These molecules are tiny compared to the wavelength of light, and they scatter shorter wavelengths (blue, violet) much more strongly than longer wavelengths (red, orange). This is **Rayleigh scattering**.',
            'During the day, sunlight only has to pass through a relatively thin slice of atmosphere to reach you. The blue wavelengths get scattered in every direction, filling the sky with blue light from all angles — which is why the sky looks blue. The longer red and orange wavelengths pass through mostly unscattered, which is why the sun itself looks yellowish-white.',
            'At sunset, the geometry changes dramatically. The sun is near the horizon, so its light must travel through up to **40 times more atmosphere** to reach your eyes. Over this much longer path, almost all the blue and green wavelengths get scattered away before they reach you. Only the longest wavelengths — red and orange — survive the journey. The sky near the horizon turns orange and red because those are the only colors left.',
          ],
          keyIdea: 'At sunset, sunlight travels through 40x more atmosphere than at noon, scattering away all short wavelengths and leaving only red and orange to reach your eyes.',
          diagram: 'RayleighScatteringDiagram',
        },
        {
          title: 'Why Assam\'s Sunsets Are Especially Vivid',
          paragraphs: [
            'Rayleigh scattering explains why all sunsets are orange, but it does not explain why some sunsets are more spectacular than others. The Brahmaputra valley is known for unusually vivid sunsets, and the reason involves a second type of scattering called **Mie scattering**.',
            'Mie scattering happens when light hits particles that are similar in size to the wavelength — things like water droplets, dust, smoke, and pollen. Unlike Rayleigh scattering (which favors short wavelengths), Mie scattering affects all wavelengths roughly equally, but it tends to scatter light *forward*, creating bright, intense glows around the sun.',
            'The Brahmaputra valley has high humidity year-round, plus suspended particles from the river, tea garden dust, and seasonal biomass burning. These particles create strong Mie scattering that intensifies the reds and oranges and adds layers of color — deep vermillion at the center, amber higher up, soft pink at the edges. The wide, reflective surface of the Brahmaputra then doubles the display by mirroring it. Geography, humidity, and physics conspire to produce the valley\'s legendary sunsets.',
          ],
          keyIdea: 'Assam\'s vivid sunsets result from Mie scattering by water droplets and particles in the humid Brahmaputra valley air, intensifying colors beyond what Rayleigh scattering alone produces.',
        },
      ],
      vocabulary: [
        ['Rayleigh scattering', 'Scattering of light by particles much smaller than the wavelength — scatters blue light about 10x more than red'],
        ['Mie scattering', 'Scattering of light by particles similar in size to the wavelength — scatters all colors roughly equally and creates bright halos'],
        ['Wavelength', 'The distance between consecutive peaks of a light wave — determines the color we see (400-700 nanometers for visible light)'],
        ['Atmosphere', 'The layer of gases surrounding Earth, about 100 km thick, that scatters, absorbs, and refracts sunlight'],
        ['Electromagnetic spectrum', 'The full range of electromagnetic radiation — from radio waves to gamma rays, with visible light as a tiny slice in the middle'],
      ],
      trueFalse: [
        { statement: 'The sun changes color as it sets.', isTrue: false, explanation: 'The sun emits the same white light all day. The color change is caused by the atmosphere filtering out short wavelengths over a longer path length at sunset. The sun looks orange because you are seeing it through more air, not because it has changed.' },
        { statement: 'Blue light is scattered about 10 times more than red light in the atmosphere.', isTrue: true, explanation: 'Rayleigh scattering intensity is proportional to 1/wavelength to the fourth power. Blue light (450 nm) has a shorter wavelength than red (700 nm), so it is scattered (700/450) to the fourth power, which is about 5.5 to 9.4 times more depending on the exact wavelengths compared.' },
        { statement: 'Pollution always makes sunsets less colorful.', isTrue: false, explanation: 'Small amounts of aerosols and particles can actually enhance sunset colors by adding Mie scattering, which intensifies reds and oranges. Volcanic eruptions famously produce spectacular sunsets worldwide. However, heavy pollution can create a dull, grey haze that blocks color entirely.' },
      ],
      facts: [
        'After the 1883 eruption of Krakatoa, sunsets around the world turned vivid red and purple for over a year because volcanic ash particles in the stratosphere created intense Mie scattering.',
        'The Brahmaputra is one of the widest rivers in the world — up to 10 km across during monsoon — creating a massive reflective surface that mirrors sunset colors and doubles the visual spectacle.',
        'On Mars, sunsets are blue. Mars has a thin atmosphere with fine iron oxide dust that scatters longer (red) wavelengths more than shorter ones — the exact opposite of Earth. A Martian sunset looks like a blue glow around a white sun.',
      ],
      offlineActivity: 'Fill a clear glass with water and add a few drops of milk (just enough to make it slightly cloudy). Shine a flashlight through the glass from the side. From the side, the water looks bluish (short wavelengths scattered toward you). Looking straight through the glass at the flashlight, it looks orange or red (short wavelengths scattered away, leaving long wavelengths). You have just recreated Rayleigh scattering — the same physics that makes blue skies and orange sunsets.',
    },
  },
  {
    slug: 'kite-festival',
    story: { title: 'The Kite Festival of Guwahati', tagline: 'Kites over the river — flight in your hands.', content: '' },
    stem: {
      title: 'Aerodynamics & Flight',
      description: 'Kites over the river — flight in your hands.',
      icon: Rocket,
      color: 'from-sky-400 to-blue-500',
      skills: [],
      project: { title: '', description: '', steps: [] },
      realWorld: [],
    },
    illustration: '/content/illustrations/fun-facts.webp',
    track: 'school',
    subjects: ['Biology'] as Subject[],
    toolSkills: ['Matplotlib' as Skill, 'NumPy' as Skill, 'Python' as Skill],
    learningTracks: ['Programming' as Track, 'Science & Lab' as Track],
    estimatedHours: 12,
    playground: 'kite-festival' as const,
    level0: {
      concepts: [
        {
          title: 'How Does a Kite Stay in the Air?',
          paragraphs: [
            'A kite is heavier than air, so gravity pulls it down. Yet it stays up. Why? Because moving air pushes on it with a force greater than its weight. This upward push is called **lift**, and understanding it is the foundation of all aerodynamics — from kites to drones to passenger jets.',
            'When wind hits a kite, the kite is tilted at an angle to the wind (called the **angle of attack**). The air hitting the bottom surface is deflected downward. By Newton\'s third law, if the kite pushes air down, the air pushes the kite up. That upward component of the force is lift. The string keeps the kite from blowing away, holding it at the correct angle so the wind keeps generating lift.',
            'But there is a cost: the wind also pushes the kite backward. This rearward force is called **drag**. For a kite to fly successfully, lift must be greater than the kite\'s weight, and the string must be strong enough to resist the drag. The art of kite design is maximizing the ratio of lift to drag — getting the most upward force for the least backward force.',
          ],
          keyIdea: 'A kite flies because wind deflected by the angled surface creates lift (upward force) that exceeds the kite\'s weight, while the string resists drag (backward force).',
        },
        {
          title: 'Bernoulli\'s Principle and Pressure Differences',
          paragraphs: [
            'Newton\'s laws explain most of how a kite flies, but there is a second mechanism at work. **Bernoulli\'s principle** states that faster-moving air exerts lower pressure than slower-moving air. When wind flows over a curved or angled surface, the air on one side moves faster than the air on the other side.',
            'On a kite tilted into the wind, air flowing over the top surface speeds up (it has farther to travel around the curve), creating a region of **low pressure** above the kite. The air below moves slower, creating **higher pressure** underneath. This pressure difference pushes the kite upward — an additional source of lift on top of the Newtonian deflection effect.',
            'This same principle keeps airplanes in the sky. An airplane wing (called an **airfoil**) is shaped so that air moves faster over the curved top surface and slower under the flatter bottom surface. The resulting pressure difference generates enough lift to hold a 400-tonne aircraft in the air. A kite is the simplest airfoil — a flat surface tilted into the wind — and it demonstrates the same physics that makes flight possible.',
          ],
          keyIdea: 'Bernoulli\'s principle explains that faster air creates lower pressure — the pressure difference between the top and bottom of a kite (or wing) is an additional source of lift.',
        },
        {
          title: 'Designing for Flight: Shape, Weight, and Balance',
          paragraphs: [
            'At the Guwahati kite festival, you will see dozens of kite shapes: diamonds, deltas, box kites, and stunt kites. Each shape represents a different engineering trade-off. A flat diamond kite is simple but unstable — it wobbles in unsteady wind. A delta kite has a triangular shape that self-corrects in gusty conditions. A box kite generates enormous lift but is heavy and hard to transport.',
            'Three factors determine how well a kite flies: **aspect ratio** (the ratio of wingspan to width — longer, narrower kites are more efficient), **weight distribution** (the center of gravity must be slightly below the attachment point for stability), and **bridle angle** (the angle at which the string attaches, which controls the angle of attack).',
            'These same design principles scale directly to aircraft design. The Wright Brothers tested their ideas with kites before building the first airplane. Modern wind tunnel testing is essentially studying the same forces that act on a kite — lift, drag, and stability — at higher speeds and larger scales. Every kite flyer at Guwahati\'s festival is an experimental aerodynamicist, whether they know it or not.',
          ],
          keyIdea: 'Kite design involves the same engineering trade-offs as aircraft design — aspect ratio for efficiency, weight distribution for stability, and angle of attack for lift control.',
        },
      ],
      vocabulary: [
        ['Lift', 'The upward force generated when moving air is deflected by an angled surface — must exceed weight for flight'],
        ['Drag', 'The backward force that resists motion through air — caused by air friction and pressure differences'],
        ['Angle of attack', 'The angle between the kite (or wing) surface and the direction of incoming wind — controls how much lift is generated'],
        ['Bernoulli\'s principle', 'Faster-moving fluid exerts lower pressure — explains the pressure difference between the top and bottom of a wing'],
        ['Airfoil', 'A surface shaped to generate lift when air moves over it — wings, propellers, and kites are all airfoils'],
      ],
      trueFalse: [
        { statement: 'A kite stays up because it is lighter than air.', isTrue: false, explanation: 'Kites are much heavier than the air they displace — they are not like helium balloons. A kite stays up because the force of moving wind deflected by its angled surface (lift) exceeds the downward pull of gravity. No wind, no flight — a kite without wind falls straight down.' },
        { statement: 'Faster-moving air creates lower pressure than slower-moving air.', isTrue: true, explanation: 'This is Bernoulli\'s principle, one of the fundamental laws of fluid dynamics. It explains why airplane wings generate lift, why shower curtains get sucked inward, and why a spinning baseball curves — faster air on one side creates lower pressure, and the object moves toward the low-pressure zone.' },
        { statement: 'The shape of a kite does not affect how well it flies.', isTrue: false, explanation: 'Shape is critical. A diamond kite behaves very differently from a delta or box kite. The aspect ratio, curvature, and surface area all determine how much lift and drag are generated. This is why aircraft wings are precisely engineered — even small changes in shape dramatically affect performance.' },
      ],
      facts: [
        'Kites were invented in China over 2,800 years ago. They were used for military signaling, measuring distances, lifting observers for reconnaissance, and testing weather conditions — making them one of the earliest flying technologies.',
        'The Wright Brothers spent three years flying kites and gliders at Kitty Hawk before attempting powered flight in 1903. They used their kite experiments to understand lift, drag, and control surfaces — the same forces that keep a festival kite aloft.',
        'The world record for kite altitude is 4,879 meters (over 16,000 feet), set in Australia in 2014. At that altitude, the kite was higher than most clouds and nearly as high as the summit of Mont Blanc, Europe\'s tallest mountain.',
      ],
      offlineActivity: 'Make two simple kites from identical materials (paper and sticks) but with different shapes — one diamond and one rectangular. Fly them in the same wind conditions. Note which flies more stably, which pulls harder on the string, and which requires more wind to stay up. Change the bridle point (where the string attaches) up and down by 1 cm each time and observe how the flight angle changes. You are testing the same variables — lift, drag, and angle of attack — that aerospace engineers test in wind tunnels.',
    },
  },
  {
    slug: 'grandmothers-pitha',
    story: { title: 'Grandmother\'s Pitha Stories', tagline: 'Every pitha has a story — food science in every bite.', content: '' },
    stem: {
      title: 'Food Science & Chemistry',
      description: 'Every pitha has a story — food science in every bite.',
      icon: Sparkles,
      color: 'from-amber-400 to-yellow-500',
      skills: [],
      project: { title: '', description: '', steps: [] },
