    level0: {
      concepts: [
        {
          title: 'Inside a Bee Colony',
          paragraphs: [
            'A honeybee colony is one of the most complex societies on Earth. A single hive contains **30,000 to 60,000 bees**, all working together with no boss, no manager, and no central plan. Instead, each bee follows simple rules based on its age and the needs of the colony, and the complex behaviour of the whole hive **emerges** from these simple individual actions.',
            'The colony has three types of bee. The **queen** is the only bee that lays eggs — up to 2,000 per day. The **drones** (males) exist only to mate with queens from other colonies. The **workers** (all female) do everything else: building comb, nursing larvae, guarding the entrance, foraging for nectar, and making honey.',
            'A worker bee lives only about 6 weeks in summer. In that short life, she will perform different jobs in sequence: first nursing (days 1-12), then building wax comb (days 12-18), then guarding the hive entrance (days 18-21), and finally foraging outside (days 21 until death). This is not a choice — it is triggered by hormonal changes as she ages.',
          ],
          keyIdea: 'A bee colony is a superorganism — thousands of individuals following simple rules that produce complex, intelligent collective behaviour without any central control.',
        },
        {
          title: 'The Waggle Dance — Nature\'s GPS',
          paragraphs: [
            'When a forager bee finds a good source of nectar, she returns to the hive and performs the **waggle dance** — one of the most remarkable communication systems in the animal kingdom. By dancing on the vertical surface of the comb, she tells other bees exactly where the food is.',
            'The dance has two parts. During the **waggle run**, the bee walks in a straight line while vibrating her abdomen. The **angle** of this line relative to vertical tells the other bees the direction of the food relative to the sun. The **duration** of the waggle tells them the distance — roughly 1 second of waggling for every 1 kilometre. After the waggle run, the bee circles back and repeats.',
            'This means bees can communicate direction and distance using a symbolic language — they translate a real-world location into an abstract code (an angle and a duration) that other bees can decode. Karl von Frisch won the Nobel Prize in 1973 for deciphering the waggle dance. It was the first proof that insects can use **symbolic communication**.',
          ],
          keyIdea: 'The waggle dance is a symbolic language — bees encode direction and distance into movement, and other bees decode it. This is abstract communication, not just a signal.',
        },
        {
          title: 'Pollination — Why Bees Matter More Than Honey',
          paragraphs: [
            'Honey is valuable, but pollination is priceless. When a bee visits a flower to collect nectar, pollen grains stick to her fuzzy body. When she visits the next flower, some of that pollen rubs off onto the new flower\'s stigma, fertilizing it. This is **pollination** — and without it, the flower cannot produce fruit or seeds.',
            'About **75% of all flowering plant species** and **35% of global food crops** depend on animal pollinators, mostly bees. Without bees, there would be no apples, almonds, blueberries, cucumbers, or coffee. The economic value of bee pollination worldwide is estimated at over $200 billion per year.',
            'The **Khasi people of Meghalaya** have practiced sustainable honey hunting for generations. They harvest honey from wild *Apis dorsata* (rock bee) colonies on cliff faces, but they never take all the honey — they leave enough for the bees to survive. This is not just tradition; it is sound ecology. A dead colony pollinates nothing. A healthy colony fed by a wise hunter pollinates the entire forest.',
          ],
          keyIdea: 'Bees are not honey machines — they are the reproductive system of the flowering world. Without pollination, most of the food we eat would not exist.',
        },
      ],
      vocabulary: [
        ['Waggle dance', 'A figure-eight dance performed by forager bees to communicate the direction and distance of a food source to other bees in the hive'],
        ['Pollination', 'The transfer of pollen from one flower to another, enabling fertilization and the production of fruit and seeds — mostly done by bees'],
        ['Entomology', 'The scientific study of insects — the largest branch of zoology, since insects make up over 80% of all known animal species'],
        ['Colony collapse', 'The sudden disappearance of worker bees from a hive — a major threat to agriculture, linked to pesticides, parasites, and habitat loss'],
        ['Apis dorsata', 'The giant rock bee of South and Southeast Asia — builds large, exposed combs on cliffs and trees, and produces the honey harvested by Khasi honey hunters'],
      ],
      trueFalse: [
        { statement: 'The waggle dance communicates the colour of the flowers to other bees.', isTrue: false, explanation: 'The waggle dance communicates direction (angle relative to the sun) and distance (duration of the waggle run) — not colour, shape, or type of flower. Bees learn what the food source smells like from the scent on the dancing bee\'s body, not from the dance itself.' },
        { statement: 'More than a third of global food crops depend on bee pollination.', isTrue: true, explanation: 'About 35% of global food crop production depends on animal pollinators, with bees being the most important. Crops like almonds are almost 100% dependent on bee pollination — without bees, there would be no almond harvest at all.' },
        { statement: 'Worker bees are all male because they do the hard physical work.', isTrue: false, explanation: 'Worker bees are all female. They do all the work of the colony — foraging, building, nursing, guarding, and making honey. Male bees (drones) do no work at all. Their only purpose is to mate with queens from other colonies.' },
      ],
      facts: [
        'A single honeybee visits 50 to 1,000 flowers per foraging trip and makes about 10 trips per day. Over her lifetime, one bee produces roughly 1/12th of a teaspoon of honey. That jar of honey on your shelf represents millions of flower visits.',
        'The Khasi honey hunters of Meghalaya climb cliff faces up to 30 metres high using bamboo ladders and ropes to reach wild rock bee nests. The skill is passed from parent to child, and each clan has traditional rights to specific cliff faces.',
        'Bees can see ultraviolet light, which humans cannot. Many flowers have UV patterns called "nectar guides" — invisible to us but glowing like airport runway lights to a bee, directing it straight to the nectar.',
      ],
      offlineActivity: 'Find a flowering plant with visiting bees (a garden, a park, or even a window box). Watch one bee for as long as you can. Count how many flowers it visits before flying away. Time how long it spends on each flower. Does it visit flowers of the same colour, or different colours? Does it visit nearby flowers or skip around? You are doing behavioural ecology — the same science that led Karl von Frisch to discover the waggle dance.',
    },
  },
  {
    slug: 'monsoon-home',
    story: { title: 'How the Monsoon Found Its Way Home', tagline: 'Climate science in a story about rain.', content: '' },
    stem: {
      title: 'Climate Patterns & Jet Streams',
      description: 'Climate science in a story about rain.',
      icon: Cloud,
      color: 'from-sky-400 to-blue-500',
      skills: [],
      project: { title: '', description: '', steps: [] },
      realWorld: [],
    },
    illustration: '/content/illustrations/fun-facts.webp',
    track: 'school',
    subjects: ['Biology'] as Subject[],
    toolSkills: ['Data Analysis' as Skill, 'Matplotlib' as Skill, 'NumPy' as Skill, 'Python' as Skill],
    learningTracks: ['AI & Data' as Track, 'Programming' as Track, 'Science & Lab' as Track],
    estimatedHours: 12,
    playground: 'monsoon-home' as const,
    level0: {
      concepts: [
        {
          title: 'What Is a Monsoon?',
          paragraphs: [
            'A monsoon is not just heavy rain — it is a **seasonal reversal of wind direction** caused by the different heating rates of land and ocean. In summer, the Indian subcontinent heats up much faster than the Indian Ocean. Hot air over the land rises, creating a low-pressure zone. Moist air from the ocean rushes in to fill it, bringing rain. In winter, the process reverses — the land cools faster, creating high pressure, and dry air flows from land to sea.',
            'This is the same principle as a sea breeze at the beach, just on a continental scale. At the beach, land heats up in the morning, warm air rises, and cool ocean air flows in. By evening, the land cools and the breeze reverses. The monsoon is a sea breeze that takes six months per cycle instead of twelve hours.',
            'India\'s **southwest monsoon** arrives at the Kerala coast around June 1st, then moves northward and eastward, reaching the Northeast by mid-June. It brings **70 to 90 percent** of India\'s annual rainfall in just four months. For hundreds of millions of farmers, the monsoon is not just weather — it is the difference between a harvest and a famine.',
          ],
          keyIdea: 'A monsoon is a giant seasonal sea breeze — driven by the temperature difference between land and ocean. When the land heats up, moist ocean air rushes in and brings rain.',
        },
        {
          title: 'Jet Streams — Rivers of Air',
          paragraphs: [
            'High above the monsoon clouds, at altitudes of 9 to 16 km, blow the **jet streams** — narrow bands of extremely fast wind (200 to 400 km/h) that circle the Earth. Jet streams are driven by temperature differences between tropical and polar air masses, and they have an enormous influence on weather patterns below.',
            'The **subtropical jet stream** plays a key role in the Indian monsoon. In winter, it flows south of the Himalayas, blocking moist air from moving north. In late May, as the Tibetan Plateau heats up, the jet stream shifts northward — jumping from south of the Himalayas to north of them. This shift "opens the gate" for the monsoon to surge into India.',
            'If the jet stream shifts late, the monsoon is late, and crops suffer. If it shifts erratically, the monsoon is uneven — some regions flood while others experience drought. Understanding jet stream behaviour is one of the most important challenges in monsoon forecasting.',
          ],
          keyIdea: 'Jet streams are invisible rivers of air at high altitude that act as gatekeepers for the monsoon. When the subtropical jet jumps north of the Himalayas, the monsoon begins.',
        },
        {
          title: 'The Indian Ocean Dipole — The Monsoon\'s Remote Control',
          paragraphs: [
            'The **Indian Ocean Dipole (IOD)** is a pattern of sea surface temperature difference between the western and eastern Indian Ocean. When the western Indian Ocean is warmer than the eastern Indian Ocean (a "positive IOD"), more moisture evaporates in the west, strengthening the monsoon and bringing above-average rainfall to India.',
            'When the pattern reverses (a "negative IOD"), the eastern Indian Ocean is warmer, moisture shifts away from India, and the monsoon weakens. The IOD was only discovered in 1999 by Japanese scientist Saji Hameed and his team — before that, scientists struggled to explain why some monsoon years were so different from others.',
            'The IOD interacts with another climate pattern you may have heard of — **El Nino**, a warming of the Pacific Ocean that typically weakens the Indian monsoon. When El Nino and a negative IOD occur together, India can experience severe drought. When a positive IOD counteracts El Nino, the monsoon may still deliver decent rainfall. These ocean patterns are like remote controls for India\'s weather.',
          ],
          keyIdea: 'The Indian Ocean Dipole is a seesaw of ocean temperatures that can strengthen or weaken the monsoon from thousands of kilometres away — the ocean controls the rain.',
        },
      ],
      vocabulary: [
        ['Monsoon', 'A seasonal reversal of wind direction caused by differential heating of land and ocean — brings 70-90% of India\'s annual rainfall'],
        ['Jet stream', 'A narrow band of very fast wind (200-400 km/h) at high altitude that influences weather patterns on the surface below'],
        ['Indian Ocean Dipole', 'A difference in sea surface temperature between the western and eastern Indian Ocean that strengthens or weakens the monsoon'],
        ['El Nino', 'A periodic warming of the central and eastern Pacific Ocean that disrupts global weather patterns and typically weakens the Indian monsoon'],
        ['Orographic rainfall', 'Rain caused when moist air is forced upward by a mountain range — the reason Meghalaya\'s Khasi Hills receive extreme rainfall'],
      ],
      trueFalse: [
        { statement: 'The monsoon is caused by heavy rain clouds forming randomly over the Indian Ocean.', isTrue: false, explanation: 'The monsoon is a systematic, seasonal wind reversal caused by the temperature difference between the Indian subcontinent and the Indian Ocean. The rain is a consequence of this wind system, not a random event. It arrives at predictable times each year.' },
        { statement: 'The jet stream must shift north of the Himalayas for the monsoon to begin.', isTrue: true, explanation: 'In winter, the subtropical jet stream flows south of the Himalayas, blocking moist ocean air. When the Tibetan Plateau heats up in late May, the jet shifts northward, removing the barrier and allowing the monsoon to surge into India.' },
        { statement: 'El Nino always causes drought in India.', isTrue: false, explanation: 'While El Nino typically weakens the Indian monsoon, a strong positive Indian Ocean Dipole can counteract its effects. Some El Nino years have seen normal or even above-average monsoon rainfall in India because the IOD provided a counterbalancing influence.' },
      ],
      facts: [
        'Cherrapunji and Mawsynram in Meghalaya receive over 11,000 mm of rain per year — almost all during the monsoon months — because the moist monsoon winds are forced sharply upward by the Khasi Hills, cooling the air and squeezing out nearly all its moisture.',
        'The Indian monsoon directly affects the lives of over 1.4 billion people. A 10% shortfall in monsoon rainfall can reduce India\'s agricultural output by enough to affect global food prices.',
        'The word "monsoon" comes from the Arabic word *mawsim*, meaning "season." Arab traders used the seasonal wind reversals to sail to India in summer (with the southwest wind) and return home in winter (with the northeast wind).',
      ],
      offlineActivity: 'Test the monsoon principle at home. Fill a dark-coloured plate with soil and a light-coloured bowl with water. Place both in the sun for 30 minutes. Now feel each surface — the soil will be much hotter than the water. Hold your hand above each and feel which has more rising warm air. This temperature difference is what drives the monsoon — the land heats up fast, creating rising air, and the cooler ocean air rushes in to replace it, bringing moisture.',
    },
  },
  {
    slug: 'grandmother-remembered',
