    level0: {
      concepts: [
        {
          title: 'What Is a Map, Really?',
          paragraphs: [
            'A map is a **model** of the real world — a simplified, flattened version of a place that helps you understand it without being there. Every map makes choices about what to include and what to leave out. A road map ignores trees. A forest map ignores roads. No map shows everything.',
            'The biggest challenge in mapmaking is that the Earth is a sphere, but a map is flat. Try wrapping a piece of paper smoothly around an orange — it wrinkles and tears. Cartographers solve this using **projections**: mathematical formulas that stretch and squish the sphere to fit a flat surface. Every projection distorts something — shape, size, distance, or direction. The famous Mercator projection makes Greenland look as big as Africa, even though Africa is 14 times larger.',
            'In the hills of **Meghalaya**, mapping is especially hard. The terrain is steep, covered in dense forest, and often shrouded in clouds. Traditional surveyors had to climb every ridge on foot, taking measurements with compasses and chains. A single map sheet could take months to complete.',
          ],
          keyIdea: 'Every map is a compromise — a model that simplifies reality. The mapmaker decides what to show, what to hide, and how to flatten a curved Earth onto a flat page.',
        },
        {
          title: 'Coordinates — Giving Every Place an Address',
          paragraphs: [
            'How do you describe a location so precisely that someone on the other side of the planet can find it? You use **coordinates** — two numbers that pinpoint any spot on Earth. **Latitude** measures how far north or south you are from the Equator (0 to 90 degrees). **Longitude** measures how far east or west you are from the Prime Meridian in Greenwich, England (0 to 180 degrees).',
            'Shillong, the capital of Meghalaya, sits at approximately **25.57 degrees North, 91.88 degrees East**. Those two numbers are enough to find it on any map in the world. Your phone\'s GPS works the same way — it receives signals from satellites and calculates your latitude and longitude to within a few metres.',
            'Before GPS, surveyors in Meghalaya used **triangulation** — measuring angles to known landmarks from two different positions, then using trigonometry to calculate distances. The Great Trigonometrical Survey of India (started in 1802) mapped the entire subcontinent this way, peak by peak, over 70 years.',
          ],
          keyIdea: 'Coordinates are a universal addressing system for the Earth. Latitude and longitude let anyone find any location, whether using a paper map or a GPS satellite.',
        },
        {
          title: 'GIS — Maps That Think',
          paragraphs: [
            'A **Geographic Information System (GIS)** is a computer system that stores, analyzes, and displays geographic data. Unlike a paper map, a GIS can layer multiple types of information on top of each other — roads, rivers, elevation, population, rainfall, forest cover — and let you ask questions.',
            'For example, a GIS can answer: "Show me all villages in Meghalaya that are more than 1,000 metres above sea level, within 5 km of a river, and have fewer than 500 people." Try getting that answer from a paper map. It would take hours. A GIS does it in seconds.',
            'GIS is used for disaster planning (which areas will flood if the river rises 3 metres?), conservation (where are the most endangered forests?), urban planning (where should we build a new school?), and disease tracking (where is malaria spreading?). The skill of reading and creating geographic data is one of the most employable skills in the 21st century.',
          ],
          keyIdea: 'GIS turns maps from static pictures into dynamic tools that can answer questions, reveal patterns, and help make decisions about the real world.',
        },
      ],
      vocabulary: [
        ['Latitude', 'The angular distance north or south of the Equator, measured in degrees (0 at the Equator, 90 at the poles)'],
        ['Longitude', 'The angular distance east or west of the Prime Meridian (Greenwich, England), measured in degrees (0 to 180)'],
        ['Map projection', 'A mathematical method for representing the curved Earth on a flat surface — every projection distorts something'],
        ['GIS', 'Geographic Information System — computer software that stores, layers, and analyzes spatial data to answer geographic questions'],
        ['Triangulation', 'A surveying technique that calculates distances by measuring angles from two known points — the basis of all early mapping'],
      ],
      trueFalse: [
        { statement: 'The Mercator projection shows all countries at their correct relative size.', isTrue: false, explanation: 'The Mercator projection preserves direction (useful for navigation) but badly distorts size near the poles. Greenland appears as large as Africa, when in reality Africa is about 14 times bigger. No flat map can perfectly represent a sphere.' },
        { statement: 'GPS satellites help your phone determine your location using latitude and longitude.', isTrue: true, explanation: 'GPS receivers calculate your position by measuring the time it takes for signals to arrive from multiple satellites. With signals from at least 4 satellites, your phone can determine your latitude, longitude, and altitude to within a few metres.' },
        { statement: 'A GIS is just a digital version of a paper map.', isTrue: false, explanation: 'A GIS is far more than a digital map. It stores multiple layers of data (elevation, population, rainfall, roads) and lets you analyze relationships between them. You can query a GIS, run simulations, and discover patterns that would be invisible on a paper map.' },
      ],
      facts: [
        'The Great Trigonometrical Survey of India (1802-1871) was one of the largest scientific projects in history. It measured the height of Mount Everest, mapped the Indian subcontinent, and employed thousands of surveyors over seven decades.',
        'Meghalaya\'s Khasi Hills are so steep that some villages can only be reached by climbing root bridges — living bridges grown from the roots of rubber fig trees over 15-30 years. Mapping these paths requires walking every one of them.',
        'Modern satellites can map the Earth\'s surface to a resolution of 30 centimetres — meaning they can distinguish individual cars, trees, and even large animals from space.',
      ],
      offlineActivity: 'Create a treasure map of your school or home. Use a compass (or your phone\'s compass) to mark North. Draw landmarks to scale — measure real distances in steps and convert them (1 step = 1 cm on your map). Add a legend explaining your symbols. Include coordinates: pick a corner as your origin (0,0) and label a grid. Hide a small object and write its grid coordinates. Give the map to a friend and see if they can find it.',
    },
  },
  {
    slug: 'monkey-bridge',
    story: { title: 'The Monkey Bridge of Namdapha', tagline: 'Primates crossing a river — forest canopy science.', content: '' },
    stem: {
      title: 'Primatology & Forest Canopy',
      description: 'Primates crossing a river — forest canopy science.',
      icon: Leaf,
      color: 'from-green-500 to-emerald-500',
      skills: [],
      project: { title: '', description: '', steps: [] },
      realWorld: [],
    },
    illustration: '/content/illustrations/monkey-bridge-namdapha.webp',
    track: 'school',
    subjects: ['Biology'] as Subject[],
    toolSkills: ['Lab Skills' as Skill, 'Python' as Skill],
    learningTracks: ['Science & Lab' as Track],
    estimatedHours: 12,
    playground: 'monkey-bridge' as const,
    level0: {
      concepts: [
        {
          title: 'What Is the Forest Canopy?',
          paragraphs: [
            'A tropical forest is not one habitat — it is several, stacked on top of each other like floors in a building. The **forest floor** is dark and damp. The **understory** is a tangle of small trees and shrubs. The **canopy** — 20 to 40 metres above the ground — is where most of the action happens. Here, the treetops form a continuous roof of leaves that captures 95% of the sunlight before it reaches the ground.',
            'The canopy is the engine of the forest. It is where photosynthesis happens at its highest rate, where most fruit and flowers grow, and where the majority of the forest\'s animal species live. Scientists estimate that **50 to 90 percent of all species in a tropical rainforest** live in the canopy and may never touch the ground.',
            'In **Namdapha National Park** in Arunachal Pradesh — one of the largest protected areas in the Eastern Himalayas — the canopy is home to hornbills, flying squirrels, gibbons, and several species of macaques. For these animals, the canopy is not the top of the forest. It is the floor of their world.',
          ],
          keyIdea: 'The forest canopy is a separate ecosystem suspended in the air — a world of its own where most tropical species live, eat, and travel without touching the ground.',
        },
        {
          title: 'Macaques — Primate Problem-Solvers',
          paragraphs: [
            '**Primatology** is the scientific study of primates — the group of mammals that includes monkeys, apes, and humans. Primates are interesting to scientists because they have large brains relative to their body size, complex social structures, and the ability to learn from each other.',
            'The **Assamese macaque** and **Arunachal macaque** live in the forests of Namdapha. These monkeys travel through the canopy in groups of 20 to 50, leaping from tree to tree. When they encounter a gap — a river, a clearing, a road — they face a genuine engineering problem: how do you cross a space where there are no branches to grab?',
            'Macaques solve this with intelligence and cooperation. They find the narrowest crossing point, test branches for strength before committing their weight, and use their tails and limbs to create **living bridges** that younger or weaker members can cross. Mothers carry infants on their bellies while leaping. The group\'s route through the canopy is not random — it is a learned map, passed from generation to generation.',
          ],
          keyIdea: 'Macaques are not just swinging randomly through trees — they are making calculated decisions about routes, risks, and group safety, using knowledge passed down through generations.',
        },
        {
          title: 'Canopy Ecology — Why Connectivity Matters',
          paragraphs: [
            'When a road or clearing cuts through a forest, it does not just remove trees — it **breaks the canopy highway**. Animals that travel through the treetops are suddenly stranded. A gap of just 10 metres can be uncrossable for a monkey that cannot swim or a squirrel that cannot fly far enough.',
            'This is called **habitat fragmentation**, and it is one of the biggest threats to forest wildlife. A fragmented forest might still have the same total area of trees, but if the canopy is broken into disconnected patches, populations become isolated. Isolated groups cannot find mates from other groups, leading to inbreeding. They cannot follow food sources that move seasonally. They cannot escape local threats like fire or disease.',
            'Conservation scientists now build **canopy bridges** — ropes, poles, or planted trees that reconnect broken canopy. In Borneo, orangutans use artificial rope bridges to cross roads. In Australia, possums use them to cross highways. The principle is simple: if you broke the highway, you need to build a bridge.',
          ],
          keyIdea: 'A broken canopy is like a broken road — it isolates populations and threatens survival. Canopy bridges are a simple, powerful conservation tool that reconnects fragmented forest.',
        },
      ],
      vocabulary: [
        ['Canopy', 'The uppermost layer of the forest, formed by the crowns of the tallest trees — typically 20 to 40 metres above the ground'],
        ['Primatology', 'The scientific study of primates (monkeys, apes, lemurs, and humans) — their behaviour, biology, and evolution'],
        ['Habitat fragmentation', 'When a continuous habitat is broken into smaller, disconnected patches — one of the greatest threats to biodiversity'],
        ['Arboreal', 'Living primarily in trees — arboreal animals are adapted for climbing, leaping, and gripping branches'],
        ['Brachiation', 'A form of movement where primates swing from branch to branch using their arms — gibbons are the masters of this technique'],
      ],
      trueFalse: [
        { statement: 'Most species in a tropical rainforest live on the forest floor.', isTrue: false, explanation: 'Scientists estimate that 50 to 90 percent of all species in a tropical rainforest live in the canopy. The forest floor is actually relatively barren — dark, damp, and home to fewer species than the sunlit canopy above.' },
        { statement: 'Macaques learn travel routes from older group members rather than figuring them out alone each time.', isTrue: true, explanation: 'Primate groups pass down knowledge of safe routes, food sources, and danger zones across generations. Young macaques learn by following experienced adults — a form of cultural transmission, similar to how human children learn from their parents.' },
        { statement: 'A 10-metre gap in the forest canopy is too small to affect arboreal animals.', isTrue: false, explanation: 'For many canopy-dwelling species, even a small gap is an impassable barrier. A monkey that leaps 5 metres cannot cross a 10-metre gap. A flying squirrel might manage, but a slow loris or a tree frog cannot. Small gaps create big problems.' },
      ],
      facts: [
        'Namdapha National Park in Arunachal Pradesh is the only park in the world where four big cat species coexist — the tiger, leopard, clouded leopard, and snow leopard. It is also home to the critically endangered Namdapha flying squirrel, found nowhere else on Earth.',
        'The Arunachal macaque was only scientifically described in 2005 — making it one of the most recently discovered primate species. It had been living in the forests of Arunachal Pradesh all along, but scientists hadn\'t recognized it as a distinct species.',
        'In Malaysian Borneo, rope bridges installed over a road for orangutans were used within weeks of installation. Camera traps showed not just orangutans but also civets, monitor lizards, and squirrels using the bridges — proving that canopy connectivity benefits many species.',
      ],
      offlineActivity: 'Find a group of trees in your area (a park, garden, or roadside). Stand beneath them and look up. Can you see where the canopy is continuous (branches touching or overlapping) and where there are gaps? Draw a "canopy map" from below, shading connected areas green and gaps as white. Now imagine you are a monkey that can only travel through the green areas. Can you get from one end to the other without touching the ground? Where would you need a bridge?',
    },
  },
  {
    slug: 'fisherman-storm',
