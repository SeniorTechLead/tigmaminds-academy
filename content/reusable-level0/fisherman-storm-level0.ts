    level0: {
      concepts: [
        {
          title: 'How Storms Are Born',
          paragraphs: [
            'A storm is not random violence — it is a **heat engine**. It starts when the sun heats the surface of the ocean. Warm water evaporates, and the moist air rises. As it rises, it cools, and the water vapour condenses back into droplets, forming clouds. This condensation releases **latent heat** — energy that was stored when the water evaporated — which warms the surrounding air and makes it rise even faster.',
            'This creates a feedback loop: warm air rises, water condenses, heat is released, more air rises, more water condenses. The rising air creates a low-pressure zone at the surface, and surrounding air rushes in to fill it. If the ocean is warm enough (above 26.5 degrees Celsius) and the conditions are right, this cycle intensifies into a **tropical cyclone** — a massive rotating storm system.',
            'The **Bay of Bengal**, which borders the coast east of India and Bangladesh, is one of the most cyclone-prone bodies of water on Earth. Its warm, shallow waters provide enormous energy to developing storms. Cyclones from the Bay of Bengal have devastated the coasts of Odisha, West Bengal, Bangladesh, and Myanmar for centuries.',
          ],
          keyIdea: 'A cyclone is a heat engine powered by warm ocean water. The warmer the ocean, the more energy the storm can extract — which is why the Bay of Bengal produces such powerful cyclones.',
        },
        {
          title: 'The Coriolis Effect — Why Storms Spin',
          paragraphs: [
            'If storms are just rising air, why do they spin? The answer lies in the **Coriolis effect** — a consequence of the Earth\'s rotation. Because the Earth spins from west to east, moving air does not travel in straight lines. In the Northern Hemisphere, it curves to the right. In the Southern Hemisphere, it curves to the left.',
            'When air rushes toward a low-pressure centre (the eye of a forming storm), the Coriolis effect bends its path, causing the air to spiral rather than flow straight in. In India\'s hemisphere, cyclones rotate **counter-clockwise**. In Australia, they rotate clockwise. At the Equator itself, where the Coriolis effect is zero, cyclones cannot form — which is why there are no cyclones within about 5 degrees of the Equator.',
            'This spinning creates the characteristic structure of a cyclone: a calm **eye** at the centre (10 to 50 km wide, with clear skies), surrounded by the **eyewall** — the most violent part of the storm, with the strongest winds and heaviest rain.',
          ],
          keyIdea: 'Cyclones spin because the Earth spins. The Coriolis effect turns straight-line winds into spiral arms, creating the rotating structure we see in satellite images.',
        },
        {
          title: 'Predicting Storms — From Folklore to Satellites',
          paragraphs: [
            'For centuries, fishing communities predicted storms using **observation**: a sudden drop in air pressure (ears popping, smoke falling instead of rising), unusual swells in the ocean, changes in bird behaviour, and the colour of the sky. Many of these traditional signs are scientifically sound — they reflect real atmospheric changes.',
            'Modern storm prediction uses **weather satellites** that photograph cloud formations from space, **radar** that tracks rainfall in real time, **weather buoys** that measure ocean temperature and wave height, and **computer models** that simulate the atmosphere mathematically. The Indian Meteorological Department (IMD) can now predict a cyclone\'s landfall location 3 to 5 days in advance — enough time to evacuate millions of people.',
            'But prediction is not prevention. The deadliest cyclone in recorded history struck the coast of Bangladesh in 1970, killing an estimated 300,000 to 500,000 people — largely because there was no warning system. Today, early warning systems, cyclone shelters, and evacuation plans have dramatically reduced deaths, even as cyclone intensity increases due to warming oceans.',
          ],
          keyIdea: 'Storm prediction has improved from folklore to satellite imagery, but the core skill is the same — reading signs in nature and acting before the storm arrives.',
        },
      ],
      vocabulary: [
        ['Cyclone', 'A large rotating storm system formed over warm ocean water — called hurricanes in the Atlantic, typhoons in the Pacific, and cyclones in the Indian Ocean'],
        ['Latent heat', 'Energy stored in water vapour that is released when the vapour condenses back into liquid — the fuel that powers cyclones'],
        ['Coriolis effect', 'The deflection of moving air (and water) caused by the Earth\'s rotation — makes cyclones spin counter-clockwise in the Northern Hemisphere'],
        ['Eye', 'The calm, clear centre of a cyclone where air sinks and winds are light — surrounded by the violent eyewall'],
        ['Storm surge', 'A wall of seawater pushed ashore by a cyclone\'s winds — often the deadliest part of a storm, causing massive coastal flooding'],
      ],
      trueFalse: [
        { statement: 'Cyclones can form directly on the Equator.', isTrue: false, explanation: 'The Coriolis effect is zero at the Equator, so there is nothing to make the air spin. Cyclones need to be at least 5 degrees north or south of the Equator to develop rotation. This is why no cyclone has ever been recorded crossing the Equator.' },
        { statement: 'The eye of a cyclone is the most dangerous part of the storm.', isTrue: false, explanation: 'The eye is actually calm, with light winds and sometimes clear blue sky. The most dangerous part is the eyewall — the ring of thunderstorms immediately surrounding the eye — where winds are strongest and rain is heaviest.' },
        { statement: 'Warmer ocean temperatures generally produce stronger cyclones.', isTrue: true, explanation: 'Cyclones extract energy from warm ocean water. The warmer the water (above 26.5 degrees Celsius), the more energy is available. This is why climate scientists are concerned that warming oceans will produce more intense cyclones in the future.' },
      ],
      facts: [
        'The Bay of Bengal produces roughly 5 to 6 cyclones per year, accounting for about 7% of the world\'s tropical cyclones. But it produces a disproportionate share of the deadliest storms, because its funnel shape concentrates storm surges toward Bangladesh and Myanmar.',
        'A single large cyclone releases energy equivalent to about 10,000 nuclear bombs — most of it as latent heat from water condensation, not as wind. The wind is just a side effect of the massive heat engine.',
        'Fishermen along India\'s east coast have traditionally observed that when crabs climb out of the water onto the beach in unusual numbers, a storm is approaching. Scientists believe the crabs detect the drop in atmospheric pressure and the change in ocean currents before the storm is visible.',
      ],
      offlineActivity: 'Build a simple barometer: fill a glass halfway with water, place a balloon stretched tightly over the top, and tape a straw horizontally so one end rests on the balloon and the other extends past the rim (as a pointer). When air pressure drops (before a storm), the balloon will bulge up, pushing the straw pointer down. When pressure rises (fair weather), the balloon sinks and the pointer rises. Check it every morning for a week and record what happens to the weather each day.',
    },
  },
  {
    slug: 'boy-counted-butterflies',
    story: { title: 'The Boy Who Counted Butterflies', tagline: 'Data science starts with counting.', content: '' },
    stem: {
      title: 'Data Collection & Citizen Science',
      description: 'Data science starts with counting.',
      icon: Cpu,
      color: 'from-violet-400 to-purple-500',
      skills: [],
      project: { title: '', description: '', steps: [] },
      realWorld: [],
    },
    illustration: '/content/illustrations/fun-facts.webp',
    track: 'school',
    subjects: ['Biology'] as Subject[],
    toolSkills: ['Data Analysis' as Skill, 'Matplotlib' as Skill, 'Python' as Skill],
    learningTracks: ['AI & Data' as Track, 'Programming' as Track],
    estimatedHours: 12,
    playground: 'boy-counted-butterflies' as const,
    level0: {
      concepts: [
        {
          title: 'Why Counting Matters in Science',
          paragraphs: [
            'Science begins with **counting**. Before you can understand why something happens, you need to know how much of it there is, where it is, and whether the amount is changing. A doctor counts your heartbeats. An astronomer counts stars. An ecologist counts butterflies.',
            'The reason counting matters so much is that numbers reveal **patterns** that your eyes alone cannot see. If you visit a meadow and see "lots of butterflies," that tells you very little. But if you count 47 butterflies on Monday, 52 on Tuesday, 38 on Wednesday, and 12 on Thursday, now you have a story — something changed on Thursday. Was it the weather? A predator? A pesticide? The numbers point you toward the question.',
            'In **Namdapha National Park** in Arunachal Pradesh, scientists have documented over **500 species of butterflies** — one of the highest concentrations in India. But documenting them required thousands of hours of careful counting, recording, and identifying. Science is not just about brilliant ideas. It is mostly about patient, careful data collection.',
          ],
          keyIdea: 'Counting is not boring — it is the foundation of all science. Numbers reveal patterns invisible to the naked eye, and patterns lead to understanding.',
        },
        {
          title: 'Sampling — You Cannot Count Everything',
          paragraphs: [
            'Namdapha covers 1,985 square kilometres of dense forest. You could spend your entire life there and never see every butterfly. So how do scientists claim to know how many species exist? They use **sampling** — counting a small, carefully chosen portion and using statistics to estimate the whole.',
            'The most common method is the **transect**: walk a fixed path (say, 1 km) at a fixed speed, counting every butterfly you see within 5 metres on either side. Do this at the same time of day, in the same weather conditions, on multiple days. The counts from your transect are a **sample** — a small window into the larger population.',
            'The key to good sampling is **consistency**. If you walk faster on sunny days, you will see fewer butterflies (less time to spot them) and your data will be biased. If you only count on weekends, you might miss species that are active on weekdays. Scientists design sampling protocols to minimize these biases — the goal is data that reflects reality, not your habits.',
          ],
          keyIdea: 'You cannot count everything, so you count a sample. The quality of your science depends on how carefully you design your sampling method to avoid bias.',
        },
        {
          title: 'Citizen Science — Everyone Can Contribute',
          paragraphs: [
            '**Citizen science** is scientific research conducted partly or entirely by non-professional scientists — ordinary people who collect data, make observations, or classify images. It is one of the most powerful ideas in modern science because it turns millions of curious people into a distributed research network.',
            'Butterfly counts are one of the oldest forms of citizen science. The UK\'s Big Butterfly Count, started in 2010, has recruited over 100,000 volunteers each year to count butterflies in their gardens for 15 minutes. The data has revealed alarming declines — some species have dropped by 50% in a decade. No professional team could have gathered that much data across that large an area.',
            'India has its own citizen science platforms. The **India Biodiversity Portal** and apps like **iNaturalist** let anyone upload a photo of a butterfly (or any organism) with a GPS location and timestamp. AI helps identify the species, and the data feeds into research databases used by ecologists worldwide. You do not need a degree to do real science — you need curiosity, a camera, and a method.',
          ],
          keyIdea: 'Citizen science turns everyone into a researcher. When thousands of people collect data using consistent methods, they can answer questions no single scientist ever could.',
        },
      ],
      vocabulary: [
        ['Transect', 'A fixed path walked at a constant speed, along which organisms are counted — the standard method for ecological surveys'],
        ['Sampling', 'Studying a small, representative portion of a population to estimate characteristics of the whole — because counting everything is impossible'],
        ['Biodiversity', 'The variety of living species in a given area — higher biodiversity generally means a healthier ecosystem'],
        ['Citizen science', 'Scientific research conducted with the help of non-professional volunteers who collect data, make observations, or classify specimens'],
        ['Bias', 'A systematic error in data collection that makes results inaccurate — caused by inconsistent methods, selective observation, or flawed design'],
      ],
      trueFalse: [
        { statement: 'To study butterfly populations, scientists must count every individual butterfly in the forest.', isTrue: false, explanation: 'Counting every individual is impossible in a large area. Scientists use sampling methods like transects — counting along fixed paths under consistent conditions — and use statistics to estimate total populations from the sample.' },
        { statement: 'Citizen science data collected by volunteers can be used in real scientific research.', isTrue: true, explanation: 'Citizen science data has been published in thousands of peer-reviewed papers. When volunteers follow consistent protocols, their collective data is often more comprehensive than what any professional team could gather alone.' },
        { statement: 'A butterfly count done only on sunny days gives an accurate picture of the total butterfly population.', isTrue: false, explanation: 'This introduces a weather bias. Some species are more active on sunny days, others on cloudy days. Counting only in sunshine would over-represent sun-loving species and under-represent shade-tolerant ones, giving a distorted picture of the true community.' },
      ],
      facts: [
        'Namdapha National Park in Arunachal Pradesh harbours over 500 butterfly species — roughly a third of all butterfly species found in India — in an area smaller than most Indian cities.',
        'The monarch butterfly migrates up to 4,800 km from Canada to Mexico each autumn. Scientists tracked this migration using citizen science — thousands of volunteers across North America reported monarch sightings, slowly revealing the route over decades.',
        'A single butterfly transect survey takes only about 30 minutes, but when repeated weekly across hundreds of sites for decades, it produces one of the most valuable datasets in ecology. The UK Butterfly Monitoring Scheme has been running since 1976.',
      ],
      offlineActivity: 'Pick a spot outdoors — a garden, a park, a balcony with plants. Sit still for exactly 15 minutes and count every insect (or bird) you see. Record the time, weather, and your counts. Do this again tomorrow at the same time. And the day after. After three days, you will have a mini-dataset. Did the numbers change? Why might they have changed? You have just done your first transect survey — the same method used in Namdapha to count 500 species of butterflies.',
    },
  },
  {
    slug: 'honey-hunter',
