import { Cpu, Lightbulb, Bot, Code2, Rocket, Sparkles, Leaf } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Lesson {
  slug: string;
  story: {
    title: string;
    tagline: string;
    content: string;
  };
  stem: {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    skills: string[];
    project: {
      title: string;
      description: string;
      steps: string[];
    };
    realWorld: string[];
  };
  illustration: string;
  track: 'school' | 'bootcamp' | 'both';
  playground?: string; // story slug identifier for level components
  lesson?: {
    objectives: string[];
    prerequisites: string[];
    estimatedTime: string;
    materials: string[];
  };
}

export const lessons: Lesson[] = [
  {
    slug: 'girl-who-spoke-to-elephants',
    story: {
      title: 'The Girl Who Spoke to Elephants',
      tagline: 'A Karbi girl discovers she can understand elephant language by pressing her ear to the ground.',
      content: `In the **Karbi Anglong** hills of Assam, where the forest is so thick that sunlight has to fight its way to the ground, a girl named **Rongpharpi** had a strange habit. Every evening, she would lie flat on her stomach and press her ear to the earth.

She wasn't playing. She was listening to the **elephants**.

It had started by accident — she tripped and fell face-first into the red Karbi soil. As she lay there, she felt something through the ground — a deep, slow vibration, like the earth itself was humming. A low rumble, then a pause, then two quick pulses. It felt like *language*.

Rongpharpi spent months learning to read the patterns. A slow, steady rumble meant the herd was calm. Quick, sharp pulses meant they were nervous. A single enormous **boom** meant danger.

One October evening, she felt frantic hammering — the elephants were terrified and running toward the village. She convinced her father to move the cattle and clear a path. At midnight, fifteen elephants crashed through — fleeing a forest fire on the ridge behind them. Because the path was clear, not a single house was destroyed.

After that night, Rongpharpi became the village's **elephant listener** — a bridge between her people and the elephants, not by shouting or building fences, but by *listening*.

*Because the earth carries every voice — if you are patient enough to listen.*`,
    },
    stem: {
      title: 'AI & Wildlife Tracking',
      description: 'Rongpharpi decoded elephant communication through vibrations in the ground. Scientists do the same thing — using sensors, machine learning, and neural networks to track and understand animal behavior at scale.',
      icon: Cpu,
      color: 'from-emerald-400 to-teal-500',
      skills: [
        'Variables, lists, and math in Python — Level 1 — L1-1',
        'Sine waves and signal generation with NumPy — Level 1 — L1-5',
        'Amplitude modulation: how pulsing encodes mood — Level 1 — L1-6',
        'Waveform visualization with Matplotlib — Level 2 — L2-1',
        'Frequency analysis and pattern detection — Level 2 — L2-4',
        'Machine learning classification (k-NN) — Level 3',
      ],
      project: {
        title: 'Build an Animal Sound Classifier',
        description: 'Train a simple machine learning model that can distinguish between different animal calls using audio recordings.',
        steps: [
          'Collect and label audio samples of different animal calls',
          'Visualize sound as spectrograms using Python and matplotlib',
          'Extract features from audio using librosa',
          'Train a basic classifier (k-nearest neighbors) to identify species',
          'Test your model on new recordings and measure accuracy',
          'Discuss how this scales to real conservation projects',
        ],
      },
      realWorld: [
        'ElephantVoices uses AI to decode elephant rumbles across African reserves',
        'The Elephant Listening Project at Cornell uses ground sensors to detect seismic communication',
        'Google\'s Bioacoustics team uses ML to monitor coral reef health through sound',
      ],
    },
    illustration: '/content/illustrations/elephant-rongpharpi.webp',
    track: 'both',
    playground: 'elephant',
  },
  {
    slug: 'firefly-festival-of-majuli',
    story: {
      title: 'The Firefly Festival of Majuli',
      tagline: 'On the world\'s largest river island, a boy discovers that even the smallest lights can turn darkness into magic.',
      content: `Every year, when the monsoon clouds swallowed the moon and the power lines sagged under the weight of rain, **Majuli** became the darkest place in the world — or so it seemed to **Joon**, a boy of nine who was afraid of the dark.

That evening, sitting on the bamboo veranda, he saw it — a tiny green light, blinking on and off near the banana trees. Then another. Then ten. Then a hundred. **Fireflies.**

They came from everywhere — from the reeds by the river, from the paddy fields, from the mango groves. Thousands of them, each one no bigger than a grain of rice, each one carrying its own small lamp.

His grandmother told him the story of **Junbiri**, a little girl who caught a fallen star. But the star was too hot to hold, and it shattered into a million tiny pieces. Each piece became a firefly — a living spark, cool enough to touch, bright enough to see by.

Joon stepped off the veranda and walked into the cloud of fireflies. They landed on his arms, his hair, his shoulders. He held out his palm and a single firefly landed on it. Its glow was barely enough to see his own fingers. But when he looked up, the whole field was alive — a galaxy of green lights floating in the warm, wet air.

*One firefly is almost nothing. But together, they've turned the whole island into a sky.*

From that night on, Joon was never afraid of the dark again — because he understood that you don't need to be a big light to matter. You just need to glow.`,
    },
    stem: {
      title: 'LEDs, Circuits & Bioluminescence',
      description: 'Fireflies produce light through a chemical reaction called bioluminescence. In this lesson, you\'ll understand the science behind living light — then build your own glowing circuits that mimic nature.',
      icon: Lightbulb,
      color: 'from-amber-400 to-orange-500',
      skills: [
        'Electricity, voltage, current, and Ohm\'s Law — Level 1 — L1-1',
        'PWM — smooth brightness control for LEDs — Level 1 — L1-2',
        'Parallel circuits — wiring multiple independent LEDs — Level 1 — L1-3',
        'Randomness and constrained variation — Level 1 — L1-4',
        'Firefly synchronization (Kuramoto model) — Level 1 — L1-5',
        'Arduino for-loops and arrays — Level 2',
        'Soldering and physical circuit construction — Level 2',
      ],
      project: {
        title: 'Build a Firefly Jar',
        description: 'Create an Arduino-powered LED installation that mimics the blinking patterns of real fireflies — including synchronized flashing.',
        steps: [
          'Session 1: The science of bioluminescence — draw the luciferin reaction chain, compare firefly efficiency (98%) to LEDs (40%) and incandescent bulbs (10%). Watch slow-motion footage of firefly abdomens.',
          'Session 1: Build your first LED circuit — connect one LED + resistor to Arduino 5V. Learn Ohm\'s Law (V = IR) by calculating the right resistor value. Then wire 3 LEDs in parallel.',
          'Session 1: Write your first Arduino sketch — blink one LED with delay(). Then randomize the timing using random() so each LED blinks independently, like individual fireflies.',
          'Session 2: Replace digital on/off with analogWrite() (PWM) — create smooth fade-in/fade-out that mimics the organic glow of bioluminescence. Experiment with different fade curves.',
          'Session 2: Wire 10 LEDs, each on its own PWM pin. Give each a random blink phase. Then implement the Kuramoto model: each LED slightly adjusts its timing toward its neighbors, gradually synchronizing — exactly how real fireflies do it.',
          'Session 3: Build the enclosure — mount LEDs inside a glass jar with diffusion paper. Add a light sensor (LDR) so the jar only activates in darkness, like real fireflies. Solder permanent connections.',
        ],
      },
      realWorld: [
        'Scientists at Vanderbilt study firefly synchronization to improve wireless network protocols',
        'Bioluminescence-inspired LEDs are being developed for more energy-efficient lighting',
        'Firefly light is "cold light" — nearly 100% energy efficient vs ~10% for incandescent bulbs',
      ],
    },
    illustration: '/content/illustrations/majuli-born.webp',
    track: 'school',
    playground: 'firefly' as const,
    lesson: {
      objectives: [
        'Explain how bioluminescence works at a chemical level (luciferin + luciferase + oxygen)',
        'Build a working LED circuit on a breadboard — series and parallel configurations',
        'Program an Arduino to produce PWM-controlled fading effects that mimic organic light',
        'Understand how fireflies synchronize their flashing and relate it to coupled oscillator theory',
      ],
      prerequisites: [
        'No prior electronics experience required',
        'Basic math (multiplication, simple fractions)',
        'Curiosity about how living things produce light',
      ],
      estimatedTime: '3 sessions × 2 hours (6 hours total)',
      materials: [
        'Arduino Uno or Nano',
        'Breadboard and jumper wires',
        '10× green LEDs (5mm)',
        '10× 220Ω resistors',
        'USB cable for Arduino',
        'Computer with Arduino IDE installed',
        'Optional: clear glass jar for final enclosure',
        'Optional: soldering iron + solder for permanent build',
      ],
    },
  },
  {
    slug: 'river-dolphins-secret',
    story: {
      title: 'The River Dolphin\'s Secret',
      tagline: 'A blind dolphin teaches a boy that seeing isn\'t the only way to understand the world.',
      content: `The **Gangetic river dolphin** is almost completely blind — its eyes can only tell light from dark. It finds its way through the murky Brahmaputra using sound, sending out clicks and listening to the echoes.

A boy named **Nabajit** knew all of this because his father was a river guide in **Guwahati**. But knowing facts and understanding them are different things.

One winter morning, the fog was so thick that Nabajit couldn't see his own hand. His father turned off the motor and let the boat drift.

"Listen," said his father.

Sounds emerged. The lap of water against the hull. The distant honk of a ferry. The soft, rhythmic *pfffsshh* of a river dolphin surfacing to breathe.

"Follow the dolphin," said his father. "She knows where the deep channel is."

They drifted through the fog, following the dolphin's breathing. *Pfffsshh.* Left. *Pfffsshh.* Straight ahead. The dolphin was navigating perfectly through water she had never seen, using nothing but echoes.

Nabajit closed his eyes and tried to build a picture using only his ears. He could hear water moving faster where the channel narrowed. He could hear waves lapping against the bank. He could hear the ferry getting closer.

"I can almost see it," said Nabajit, eyes still closed. "The river. The shore. The ferry. It's all there, in the sounds."

The dolphin had taught him her secret: *the world speaks to those who close their eyes and open their ears.*`,
    },
    stem: {
      title: 'Sonar Sensors & Arduino',
      description: 'River dolphins "see" using echolocation — they send sound pulses and listen for echoes. Sonar sensors work the same way. You\'ll build a device that maps its surroundings using ultrasonic sound, just like a dolphin.',
      icon: Bot,
      color: 'from-sky-400 to-blue-500',
      skills: [
        'Sound, echoes, and the distance formula — Level 1 — L1-1',
        'Proximity alerts and threshold logic — Level 1 — L1-2',
        'Sonar scanning with servo motors — Level 1 — L1-3',
        'Temperature correction for accuracy — Level 1 — L1-4',
        'Noise filtering and sensor averaging — Level 1 — L1-5',
        'HC-SR04 wiring and real hardware — Level 2',
        'Radar sweep visualization in Python — Level 2',
      ],
      project: {
        title: 'Build a Sonar Range Finder',
        description: 'Wire an ultrasonic sensor to an Arduino with a servo motor to build a scanning sonar that maps objects in a room — displayed as a radar sweep on screen.',
        steps: [
          'Learn how dolphins use echolocation (send click, time the echo)',
          'Wire an HC-SR04 ultrasonic sensor to Arduino',
          'Write code to measure distance from echo time',
          'Mount the sensor on a servo motor for 180° scanning',
          'Send distance data over serial to a Processing or Python sketch',
          'Display results as a real-time radar/sonar sweep visualization',
        ],
      },
      realWorld: [
        'Autonomous vehicles use LiDAR and ultrasonic sensors for obstacle detection',
        'Submarines navigate with sonar — the same principle as dolphin echolocation',
        'Medical ultrasound uses sound waves to image organs and unborn babies',
      ],
    },
    illustration: '/content/illustrations/brahmaputra-angry.webp',
    track: 'school',
    playground: 'dolphin' as const,
  },
  {
    slug: 'boy-who-built-a-library',
    story: {
      title: 'The Boy Who Built a Library',
      tagline: 'A village boy with no books builds a bamboo library that changes his village forever.',
      content: `In a village called **Bhalukpara**, tucked between tea gardens and rice paddies, there lived a boy named **Dipankar** who loved reading more than anything. The problem was, he had nothing to read.

His school had one textbook per class, shared among forty students. There was no library, no bookshop. Dipankar had built a bamboo shelf — perfectly made, with little carved notches to hold books upright. But the shelf was empty.

When he was twelve, his uncle took him to **Guwahati**. Outside a college hostel, a bin overflowed with old textbooks and novels. Students were throwing them away. Dipankar's heart hammered. For three days, while his family celebrated a wedding, he walked the streets with a jute sack collecting discarded books. He came home with **sixty-three books** and two sore shoulders.

He built a small bamboo structure — open on one side — next to the village path. He wrote a sign: **"Bhalukpara Pustok Ghor — Take a book, bring it back, tell a friend."**

On the first day, nobody came. On the second day, a girl named **Rina** stopped. By the end of the month, fourteen regular readers. Word spread. Books arrived from teachers, journalists, college students. By fifteen, Dipankar had over **five hundred books** and a waiting list.

"I didn't really build a library," he told his mother. "The books were thrown away. The bamboo was already growing."

His mother smiled. "You didn't build it from nothing, Dipankar. You built it from *caring*. That's harder than bamboo."`,
    },
    stem: {
      title: 'Web Development & Databases',
      description: 'Dipankar built a physical library from discarded materials. You\'ll build a digital one — a full web application that catalogs books, tracks readers, and grows with its community.',
      icon: Code2,
      color: 'from-violet-400 to-purple-500',
      skills: [
        'HTML structure — headings, lists, semantic markup — Level 1 — L1-1',
        'CSS styling — colors, fonts, spacing, borders — Level 1 — L1-2',
        'Flexbox layout — responsive card grids — Level 1 — L1-3',
        'JavaScript interactivity — search, events, DOM — Level 1 — L1-4',
        'State management — data, rendering, updates — Level 1 — L1-5',
        'React components and props — Level 2',
        'Database design and CRUD operations — Level 2',
      ],
      project: {
        title: 'Build a Community Library App',
        description: 'Create a full-stack web application where users can browse books, borrow them, leave reviews, and track their reading history.',
        steps: [
          'Design the database schema: books, users, loans, reviews',
          'Build the frontend: book catalog with search and filters',
          'Add a book detail page with availability status',
          'Implement user signup/login',
          'Build borrow/return functionality with due dates',
          'Add a review and rating system',
        ],
      },
      realWorld: [
        'Open Library (archive.org) catalogs every book ever published using open-source web tech',
        'Libby connects public libraries to digital lending — same CRUD principles at scale',
        'Little Free Library has 150,000+ registered book-sharing boxes worldwide, tracked via web app',
      ],
    },
    illustration: '/content/illustrations/boy-clouds.webp',
    track: 'bootcamp',
    playground: 'library' as const,
  },
  {
    slug: 'dragonfly-and-the-paddy-field',
    story: {
      title: 'The Dragonfly and the Paddy Field',
      tagline: 'A dragonfly protects the rice harvest by eating the pests that threaten it — a story about the small heroes we never notice.',
      content: `In the wide, flat **Brahmaputra valley**, a paddy field belonged to a farmer named **Biren** and his wife **Bonti**. It was their whole world — it fed their family, paid school fees, and gave them enough to share during festivals.

One August, an army of **stem borers** and **leafhoppers** descended on the field — tiny, relentless creatures that chewed through the rice stalks. Pesticide cost more than they had. Hand-picking was futile — for every insect removed, ten more appeared.

One misty morning, Bonti saw a flash of iridescent **blue-green** darting above the rice. Then a dozen. Then a *hundred*. **Dragonflies.**

They came in a shimmering cloud, their wings catching the early light like chips of stained glass. Each dragonfly was a tiny hunting machine — snatching leafhoppers from the air, plucking stem borers from stalks with surgical precision. Hundreds of pests per dragonfly per day.

Among them was one larger and more brilliant than the rest — **Nila**, meaning blue. She patrolled from dawn to dusk, eating pests, chasing moths, catching mosquito larvae before they could hatch.

By September, the pest army was defeated. The rice stood tall, heads bowing under golden grain. At the harvest feast, Bonti raised her cup: "This year, I want to thank the dragonfly. She is small. She is silent. She does not ask for thanks. But without her, this field would be empty."

*To the guardian of the field.*`,
    },
    stem: {
      title: 'Drones & Computer Vision',
      description: 'Nila the dragonfly patrolled the paddy field with her compound eyes, spotting pests invisible to humans. Modern drones do the same — flying over farms with cameras and AI to detect crop disease, pest damage, and water stress.',
      icon: Rocket,
      color: 'from-rose-400 to-pink-500',
      skills: [
        'Pixels and RGB color — how computers represent images — Level 1 — L1-1',
        'Color channels and vegetation detection — Level 1 — L1-2',
        'Thresholds, binary masks, and detection trade-offs — Level 1 — L1-3',
        'Image arrays and NumPy operations on pixels — Level 1 — L1-4',
        'From pixel counts to field health reports — Level 1 — L1-5',
        'Edge detection and shape analysis — Level 1 — L1-6',
        'Image classification with ML — Level 2 — L2-1',
        'Feature extraction from images — Level 2 — L2-4',
        'Training a crop health classifier — Level 3',
      ],
      project: {
        title: 'Build a Crop Health Detector',
        description: 'Train a computer vision model that can identify healthy vs. diseased rice plants from photographs — the same tech used in agricultural drones.',
        steps: [
          'Collect and label images of healthy and diseased rice leaves',
          'Learn how convolutional neural networks (CNNs) process images',
          'Use a pre-trained model (MobileNet) and fine-tune it on your rice dataset',
          'Build a simple web interface to upload a photo and get a diagnosis',
          'Test accuracy and discuss what a drone would need to do this in-flight',
          'Explore how this scales to real precision agriculture systems',
        ],
      },
      realWorld: [
        'DJI agricultural drones spray pesticide only where computer vision detects pests',
        'PlantVillage uses phone cameras + AI to diagnose crop disease in 38 crops',
        'India\'s ICRISAT uses satellite + drone imagery to advise 4 million smallholder farmers',
      ],
    },
    illustration: '/content/illustrations/tea-leaf-fly.webp',
    track: 'both',
    playground: 'dragonfly' as const,
  },
  {
    slug: 'why-the-muga-silk-is-golden',
    story: {
      title: 'Why the Muga Silk Is Golden',
      tagline: 'The world\'s only golden silk comes from Assam. A folktale about generosity and the sun\'s gift.',
      content: `Once, long before anyone can remember, all silk was **grey**. Every silkworm spun grey threads, and the weavers of Assam wove grey cloth that looked like fog.

"I wish our silk had colour," sighed a young weaver named **Malini**, sitting at her loom in **Sualkuchi**, the silk village by the river.

In the som tree above her house lived a tiny silkworm named **Muga** — curious, and unlike other worms, she listened to humans. She set off on the longest journey any silkworm had ever taken, asking the green leaves and red flowers for their colour. But green fades in autumn and red wilts in a week.

She needed a colour that would never fade. So she crawled to the highest hill and called out to the **Sun**.

"Will you give me some of your gold?"

The Sun laughed warmly. *"Little worm, no one has ever asked me for a gift. Spin me a scarf — I get cold at night below the horizon — and I will dip your thread in my light."*

Muga spun all night — the finest thread she had ever made. When dawn came, the Sun reached down with a golden ray and touched her spinnerets. From that moment, every thread was **golden** — not painted gold, but gold from the inside, as if sunlight itself had been woven into the fibre.

Malini unwound the cocoon and gasped. She wove a **mekhela chador** so beautiful that people came from every village to see it.

To this day, muga silk is found only in Assam — the only golden silk in the world. It never fades, because the Sun's promise never expires.`,
    },
    stem: {
      title: 'Biology & Materials Science',
      description: 'Muga silk is real — it\'s the only naturally golden silk on Earth, produced by the Antheraea assamensis moth. In this lesson, you\'ll explore the biology of silk production and the materials science behind what makes some fibres extraordinary.',
      icon: Sparkles,
      color: 'from-yellow-400 to-amber-500',
      skills: [
        'Silk biology — proteins, β-sheet crystals, fibroin — Level 1 — L1-1',
        'Why muga silk is golden — xanthurenic acid chemistry — Level 1 — L1-2',
        'Tensile testing and stress-strain curves — Level 1 — L1-3',
        'Experimental design — hypothesis, variables, controls — Level 1 — L1-4',
        'Data analysis — means, error bars, conclusions — Level 1 — L1-5',
        'Microscopy and hands-on fibre testing — Level 2',
      ],
      project: {
        title: 'Materials Science Investigation',
        description: 'Compare the properties of different fibres (silk, cotton, nylon, spider silk) through hands-on experiments and microscopy.',
        steps: [
          'Session 1: Silk biology deep dive — trace the journey from som leaf → silkworm gut → spinneret → cocoon. Draw the molecular structure of fibroin (β-sheet crystals). Understand why muga silk is golden: xanthurenic acid pigment bound into the protein, not a surface dye.',
          'Session 1: Collect samples — cotton thread, nylon fishing line, raw muga silk (or eri/pat silk), and polyester. Prepare slides and examine each under a microscope (40x–100x). Sketch the fibre cross-sections and surface textures.',
          'Session 2: Tensile strength testing — build a simple test rig with a clamp, ruler, and small weights. Record the breaking force for each fibre at the same thickness. Calculate stress (force/area) and create a comparison bar chart.',
          'Session 2: Water absorption test — weigh dry samples, submerge for 30 minutes, weigh again. Which fibre absorbs most? Least? Connect this to protein structure (hydrophilic vs hydrophobic regions).',
          'Session 3: UV degradation experiment — expose samples to direct sunlight for 48 hours (or a UV lamp for 4 hours). Compare colour change, strength loss, and texture. Muga silk should show minimal degradation — document why.',
          'Session 3: Write your materials science report — hypothesis, method, data tables, charts, analysis, and conclusion. Include a section: "If you were designing a medical suture, which fibre would you choose and why?"',
        ],
      },
      realWorld: [
        'Spider silk is 5x stronger than steel by weight — labs are engineering synthetic versions',
        'Muga silk\'s UV resistance is being studied for medical sutures and wound dressings',
        'Biomimetic materials science draws from nature to create stronger, lighter, smarter materials',
      ],
    },
    illustration: '/content/illustrations/weaver-girl.webp',
    track: 'school',
    playground: 'muga' as const,
    lesson: {
      objectives: [
        'Describe the biology of silk production — from silkworm diet to protein extrusion',
        'Explain why muga silk is golden at the molecular level (xanthurenic acid in fibroin)',
        'Design and execute materials science experiments: tensile strength, water absorption, UV resistance',
        'Compare natural and synthetic fibres using the scientific method and present findings in a formal report',
      ],
      prerequisites: [
        'No prior science lab experience required',
        'Basic understanding of measurement (grams, centimeters)',
        'Ability to follow a written procedure and record observations',
      ],
      estimatedTime: '3 sessions × 2 hours (6 hours total)',
      materials: [
        'Fibre samples: cotton thread, nylon line, silk thread (any type), polyester thread',
        'Microscope (40x minimum) or USB digital microscope',
        'Glass slides and slide covers',
        'Small weights (washers, coins, or a kitchen scale)',
        'Ruler and clamp or binder clip for tensile testing',
        'Small containers for water absorption test',
        'UV lamp or access to direct sunlight',
        'Lab notebook or printed worksheet',
        'Optional: muga silk sample (available online from Assam weavers)',
      ],
    },
  },
  {
    slug: 'tejimola-the-girl-who-became-a-plant',
    story: {
      title: 'Tejimola — The Girl Who Became a Plant',
      tagline: 'A kind girl whose spirit refused to be silenced, growing back as tulsi, gourd, lotus, and champa tree.',
      content: `In a village by the river, there lived a girl named **Tejimola**. She was kind to every creature — she fed the sparrows, she sang to the fish, and she never passed a person without smiling.

When her father went on a long journey, her cruel stepmother buried Tejimola in the garden. But from that spot, a beautiful **tulsi plant** grew overnight — green and fragrant and reaching for the sun.

The stepmother pulled it out. From the riverbank, a **gourd vine** grew. She tore it down. A **lotus** bloomed in the pond. She plucked it. A **champa tree** grew — tall and golden-flowered, filling the air with perfume.

No matter what the stepmother did, Tejimola kept coming back — as a plant, as a flower, as a tree. Each time more beautiful than before.

When Tejimola's father returned, the champa tree bent its branches and touched his face. *"Father, I am here. I never left."*

Tejimola's story tells us that kindness cannot be destroyed. You can bury it, pull it out, throw it away — but it grows back, every time, in a new form.`,
    },
    stem: {
      title: 'Plant Biology & Genetics',
      description: 'Tejimola kept growing back as different plants. In the real world, plants regenerate through vegetative propagation — a single cell can become an entire organism. This lesson explores cells, photosynthesis, DNA, and genetics.',
      icon: Leaf,
      color: 'from-emerald-400 to-green-500',
      skills: [
        'Plant cells and photosynthesis — Level 1 — L1-1',
        'Vegetative propagation — cloning vs seeds — Level 1 — L1-3',
        'Growth stages and the sigmoid curve — Level 1 — L1-4',
        'DNA structure and base pairing — Level 1 — L1-6',
        'Mendelian genetics and Punnett squares — Level 2 — L2-1',
        'Natural selection and evolution — Level 2 — L2-5',
      ],
      project: {
        title: 'Plant Growth Experiment',
        description: 'Grow plants from seeds and cuttings, measure growth daily, plot sigmoid curves, and compare clone vs. seed-grown variation.',
        steps: [
          'Plant tulsi seeds and tulsi stem cuttings side by side',
          'Measure height daily for 4 weeks',
          'Plot growth curves — do they follow the sigmoid model?',
          'Compare variation: are cuttings more uniform than seedlings?',
          'Test a variable: does light intensity affect growth rate?',
          'Write a lab report with hypothesis, data, and conclusion',
        ],
      },
      realWorld: [
        'Tissue culture propagation produces millions of identical banana plants per year',
        'CRISPR gene editing is creating disease-resistant rice varieties for climate change',
        'India\'s Green Revolution (1960s-70s) used selective breeding to double wheat production',
      ],
    },
    illustration: '/content/illustrations/tejimola.webp',
    track: 'school',
    playground: 'tejimola' as const,
  },
];

export function getLessonBySlug(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}
