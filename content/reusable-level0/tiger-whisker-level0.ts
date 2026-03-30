    level0: {
      concepts: [
        {
          title: 'What Are Whiskers, Really?',
          paragraphs: [
            'A tiger\'s whiskers are not just stiff hairs — they are precision instruments called vibrissae. Each vibrissa is rooted three times deeper in the skin than ordinary fur, anchored in a capsule of blood and surrounded by up to 200 nerve endings. When the tip of a whisker brushes against something, even gently, that touch creates a tiny vibration that races down the shaft to the nerve cluster at its base.',
            'The nerves convert the mechanical vibration into an electrical signal that travels to the brain\'s somatosensory cortex — the region that builds a "touch map" of the body. In cats and tigers, an enormous portion of this brain region is devoted entirely to processing whisker data. Scientists call the sensory cells at the whisker base mechanoreceptors, because they convert mechanical force (pressure, bending, vibration) into nerve signals.',
            'This is the same principle behind many human-made sensors. A smartphone\'s accelerometer detects tiny mechanical movements and converts them to electrical signals. A car\'s parking sensor sends out a pulse and measures the vibration that bounces back. The tiger\'s whisker system is nature\'s version of haptic sensing — detecting the world through touch and vibration rather than light or sound.',
          ],
          keyIdea: 'Whiskers (vibrissae) are deep-rooted sensory organs packed with mechanoreceptors that convert touch and vibration into electrical nerve signals — nature\'s haptic sensors.',
        },
        {
          title: 'How Tigers "See" in the Dark with Whiskers',
          paragraphs: [
            'Tigers hunt primarily at night and in dense undergrowth where even their excellent eyes struggle. This is where whiskers become critical. A tiger\'s whiskers span roughly the width of its body. As the tiger moves through tall grass, its whiskers sweep forward and detect obstacles, gaps, and the shape of the space ahead. The tiger builds a real-time "touch picture" of its surroundings without needing light.',
            'Each whisker can detect air currents too. When a tiger gets close to prey, the animal\'s body displaces air, creating tiny pressure changes. The whiskers pick up these disturbances, helping the tiger judge the exact position and distance of its target in total darkness. This is why a tiger can deliver a precise killing bite to the neck even when it cannot clearly see its prey.',
            'Engineers have borrowed this idea to build whisker-like sensors for robots. These artificial whiskers — thin flexible rods with strain gauges at their base — let robots navigate in dark or dusty environments where cameras are useless. Underwater robots use similar sensors to detect water currents, just like seals use their whiskers to track fish by following the tiny water vortices the fish leave behind.',
          ],
          keyIdea: 'Whiskers let tigers navigate and hunt in darkness by detecting obstacles, gaps, and air pressure changes — a biological system that inspires robot sensor design.',
        },
        {
          title: 'Haptic Technology: Teaching Machines to Feel',
          paragraphs: [
            'The vibration you feel when your phone buzzes is haptic feedback — a machine communicating through touch. But modern haptic technology goes far beyond simple vibrations. Surgical robots now have force-feedback systems that let a surgeon "feel" how hard they are pressing on tissue, even when the robot arm is inside a patient\'s body and the surgeon is across the room.',
            'The connection to whiskers is direct. Both biological vibrissae and haptic devices solve the same problem: converting physical contact into useful information. A whisker bends and sends a nerve signal; a haptic glove compresses and sends a digital signal. The encoding is different, but the principle — translating mechanical events into data — is identical.',
            'Researchers are now building artificial skin for prosthetic hands that mimics the density of mechanoreceptors in a tiger\'s whisker pad. The goal is to let amputees feel texture, temperature, and pressure through their prosthetic. Every advance in this field starts from studying how animals like tigers pack so much sensory information into something as simple as a stiff hair.',
          ],
          keyIdea: 'Haptic technology converts physical touch into digital data, following the same principle as a tiger\'s whisker — and studying animal sensory systems drives innovation in prosthetics and robotics.',
        },
      ],
      vocabulary: [
        ['Vibrissa', 'A specialized sensory whisker rooted deep in the skin, surrounded by nerve endings — much more than ordinary hair'],
        ['Mechanoreceptor', 'A nerve cell that detects mechanical force like pressure, stretch, or vibration and converts it into an electrical signal'],
        ['Haptic', 'Relating to the sense of touch — haptic technology lets machines communicate through vibrations, pressure, or force feedback'],
        ['Somatosensory cortex', 'The brain region that processes touch information, building a "map" of what the body is feeling across its entire surface'],
        ['Strain gauge', 'A sensor that measures how much something bends or stretches — used in engineering to detect tiny deformations, just like a whisker base detects bending'],
      ],
      trueFalse: [
        { statement: 'A tiger\'s whiskers are made of the same material as its fur, just thicker.', isTrue: true, explanation: 'Both whiskers and fur are made of keratin, the same protein in your fingernails. The difference is not the material but the structure: whiskers are rooted three times deeper, surrounded by a blood-filled capsule and up to 200 nerve endings that make them sensitive touch sensors.' },
        { statement: 'Cutting a cat\'s whiskers would not affect its ability to move around.', isTrue: false, explanation: 'Whiskers are essential navigation tools. Cats with trimmed whiskers misjudge gaps, bump into objects, and become disoriented, especially in low light. The whiskers tell them whether a space is wide enough to fit through and detect nearby objects through air-current changes.' },
        { statement: 'Some robots use artificial whiskers to navigate in environments where cameras cannot work.', isTrue: true, explanation: 'Researchers have built whisker-inspired sensors from flexible rods with strain gauges at the base. These let robots detect obstacles in dark, smoky, or underwater environments where vision-based sensors fail — directly inspired by how cats and seals use their vibrissae.' },
      ],
      facts: [
        'A tiger has about 30 whiskers on each side of its muzzle, and each one can independently detect movements as small as 2 millionths of a meter — finer than the width of a human red blood cell.',
        'Seals can track a fish that swam past 30 seconds earlier by following the tiny water vortices it left behind, detected entirely through their whiskers.',
        'The word "haptic" comes from the Greek word "haptikos," meaning "able to touch." Your smartphone uses a tiny haptic motor spinning an off-center weight to create the buzz you feel with notifications.',
      ],
      offlineActivity: 'Close your eyes and have a friend place 5 different household objects (a coin, a feather, a rubber band, sandpaper, a cotton ball) in front of you. Using only a wooden skewer or pencil held between your fingers, try to identify each object by poking and dragging the stick across its surface. Notice how vibrations travel through the stick to your fingers — you are experiencing haptic sensing, the same principle a tiger\'s whisker uses. Write down what you felt for each object and how confident you were.',
    },
  },
  {
    slug: 'music-dimasa',
    story: { title: 'How Music Came to the Dimasa Kingdom', tagline: 'Rhythm and melody — music theory meets physics.', content: '' },
    stem: {
      title: 'Music Theory & Vibrations',
      description: 'Rhythm and melody — music theory meets physics.',
      icon: Music,
      color: 'from-purple-400 to-fuchsia-500',
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
    playground: 'music-dimasa' as const,
    level0: {
      concepts: [
        {
          title: 'Sound Is Vibration',
          paragraphs: [
            'Every sound you hear — a bird singing, a drum beating, your friend talking — starts with something vibrating. When a guitar string is plucked, it moves back and forth hundreds of times per second. Each back-and-forth push compresses the air molecules next to it, creating a pressure wave that travels outward in all directions, like ripples in a pond.',
            'The number of times something vibrates per second is called its frequency, measured in Hertz (Hz). A low-pitched dhol drum might vibrate at 80 Hz (80 times per second). A high-pitched flute might vibrate at 2,000 Hz. Your ear detects these pressure waves and your brain interprets them as sound.',
            'Here is the key insight: frequency determines pitch. Double the frequency and you hear a note that sounds "the same but higher" — musicians call this an octave. If one string vibrates at 200 Hz and another at 400 Hz, the second sounds exactly one octave above the first. This mathematical relationship between frequency and pitch is the foundation of all music theory.',
          ],
          keyIdea: 'Sound is vibrating air. Frequency (vibrations per second) determines pitch, and doubling the frequency raises the pitch by exactly one octave.',
        },
        {
          title: 'Why Some Notes Sound Good Together',
          paragraphs: [
            'The Dimasa people of Assam developed a sophisticated musical tradition with specific scales and harmonies. But why do certain combinations of notes sound pleasing while others sound harsh? The answer is mathematics.',
            'When two frequencies form a simple ratio — like 2:1 (octave), 3:2 (perfect fifth), or 4:3 (perfect fourth) — their sound waves line up regularly, creating a smooth, stable pattern. Your brain perceives this as consonance, or "sounding good together." When the ratio is complicated — like 45:32 — the waves clash in irregular patterns, and your brain hears dissonance.',
            'Ancient musicians across cultures discovered these ratios independently. The Dimasa seven-note scale, the Indian sargam, the Western major scale, and the Chinese pentatonic scale all rely on the same mathematical relationships. Different cultures chose different combinations of these ratios, creating distinct musical flavors, but the underlying physics is universal.',
            'This is why a melody from the Dimasa kingdom can move someone who has never been to Assam. The emotional power of music is rooted in physics — simple frequency ratios trigger pattern-recognition circuits in every human brain.',
          ],
          keyIdea: 'Notes sound harmonious when their frequencies form simple ratios (2:1, 3:2, 4:3). All musical traditions independently discovered these same mathematical relationships.',
        },
        {
          title: 'Scales, Overtones, and Timbre',
          paragraphs: [
            'When you pluck a single string, you do not hear just one frequency. The string vibrates at its fundamental frequency (the lowest pitch), but also at 2x, 3x, 4x, and higher multiples simultaneously. These extra frequencies are called overtones or harmonics. A 200 Hz string also produces faint sounds at 400 Hz, 600 Hz, 800 Hz, and so on.',
            'The mix of overtones is what makes different instruments sound different even when playing the same note. A bamboo flute and a metal bell can both play the note A (440 Hz), but the flute emphasizes odd harmonics while the bell rings with a completely different harmonic pattern. This unique sonic fingerprint is called timbre (pronounced "TAM-ber").',
            'Musical scales are systems for choosing which frequencies to use in melodies and harmonies. The Dimasa tradition uses specific intervals that create a distinct emotional character. Building a scale is really about choosing which frequency ratios to include — and every choice shapes the mood of the music that follows.',
          ],
          keyIdea: 'Every note contains a stack of overtones. The overtone recipe gives each instrument its unique voice (timbre), and scales are curated sets of frequency ratios.',
          diagram: 'MusicalWavesDiagram',
        },
      ],
      vocabulary: [
        ['Frequency', 'The number of vibrations per second, measured in Hertz (Hz) — higher frequency means higher pitch'],
        ['Octave', 'The interval between a note and another with double its frequency — they sound like the same note, just higher or lower'],
        ['Consonance', 'When two notes sound pleasing together because their frequencies form a simple mathematical ratio'],
        ['Overtone', 'Higher-frequency vibrations that sound simultaneously with the fundamental note — they shape an instrument\'s unique voice'],
        ['Timbre', 'The quality that makes a flute sound different from a drum, even on the same note — determined by the mix of overtones'],
      ],
      trueFalse: [
        { statement: 'A note played on a flute and the same note played on a drum produce exactly the same sound wave.', isTrue: false, explanation: 'They share the same fundamental frequency (pitch), but the overtone mix is completely different. The flute produces a smooth wave with few harmonics, while the drum produces a complex burst of many frequencies. This difference in overtones is why they sound so distinct — it is called timbre.' },
        { statement: 'Musicians in ancient India and ancient Greece independently discovered the same mathematical ratios in music.', isTrue: true, explanation: 'Both cultures found that pleasing intervals correspond to simple frequency ratios: 2:1 for the octave, 3:2 for the fifth, 4:3 for the fourth. These ratios are physics, not culture — any vibrating object follows the same rules, so any civilization that studied sound carefully would find them.' },
        { statement: 'The speed of sound changes depending on temperature.', isTrue: true, explanation: 'Sound travels through air at about 343 m/s at 20°C, but it speeds up in warmer air (about 0.6 m/s faster for every 1°C increase). This is why outdoor instruments go slightly out of tune as the day warms up — the speed change affects the wavelengths and therefore the pitch.' },
      ],
      facts: [
        'The Dimasa people have one of the oldest musical traditions in Northeast India, with instruments like the khram (a bamboo mouth organ) that produce complex overtone patterns similar to a pipe organ.',
        'Pythagoras discovered the connection between string length and musical pitch around 500 BC — halving a string\'s length doubles its frequency, producing a note one octave higher.',
        'The human ear can detect frequencies from about 20 Hz to 20,000 Hz, but we are most sensitive around 2,000-5,000 Hz — the range of human speech consonants, shaped by millions of years of evolution.',
      ],
      offlineActivity: 'Fill 5 identical glass bottles with different amounts of water. Blow across the top of each bottle to produce a note. Arrange them from lowest pitch (most water) to highest pitch (least water). Try to play a simple melody. You have just built a musical instrument — and the physics is the same as any wind instrument: the air column length determines the frequency.',
    },
  },
