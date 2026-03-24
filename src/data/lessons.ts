import { Cpu, Lightbulb, Bot, Code2, Rocket, Sparkles, Leaf, Sun, Cloud, Mountain, Music, TreePine, Construction } from 'lucide-react';
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
  {
    slug: 'golden-deer-of-kamakhya',
    story: {
      title: 'The Golden Deer of Kamakhya',
      tagline: 'A golden deer whose coat shines like the sun grants one wish to anyone pure of heart.',
      content: `On top of **Nilachal Hill** in Guwahati, where the ancient Kamakhya temple watches over the Brahmaputra valley, a **golden deer** once lived. Its coat shone like the sun, and its eyes sparkled like stars reflected in the river.

The deer could grant one wish to anyone whose heart was truly pure. Many climbed the hill — kings, merchants, scholars — but the deer vanished every time, because each wished for themselves.

One day, a farmer's daughter named **Junali** climbed the hill carrying nothing but a handful of rice. Instead of wishing, she offered to share her rice with the deer.

*"You came to a wishing deer, and instead of wishing, you offered to share. What do you truly want?"*

"I wish the river would be kinder to my village."

The deer stamped its hoof, and a spring of clear water bubbled up — water that flows to this day.`,
    },
    stem: {
      title: 'Optics & Light',
      description: 'The golden deer\'s coat "shone like the sun" — but why does gold shimmer? How does light create color, reflection, and sparkle? This lesson explores the physics of light.',
      icon: Sun,
      color: 'from-yellow-400 to-amber-500',
      skills: [
        'What light is — electromagnetic waves — Level 1 — L1-1',
        'Reflection and shiny surfaces — Level 1 — L1-2',
        'Refraction — light bending through water — Level 1 — L1-3',
        'Color and wavelengths — Level 1 — L1-4',
        'Lenses and optical instruments — Level 2 — L2-1',
        'Spectroscopy — splitting light into colors — Level 2 — L2-2',
      ],
      project: { title: 'Build a Spectroscope', description: 'Build a simple spectroscope from a cardboard tube and a CD to split light into its component colors.', steps: ['Understand how diffraction gratings work', 'Build the spectroscope housing', 'Observe sunlight, LED light, and fluorescent light', 'Sketch the spectrum for each light source', 'Compare to known emission spectra', 'Identify the light source from its spectrum alone'] },
      realWorld: ['Fiber optics carry 99% of international internet data using light', 'Spectroscopy identifies elements in distant stars — same technique, cosmic scale', 'Solar panels convert light energy to electricity using the photoelectric effect'],
    },
    illustration: '/content/illustrations/golden-deer.webp',
    track: 'school',
    playground: 'golden-deer' as const,
  },
  {
    slug: 'boy-who-talked-to-clouds',
    story: {
      title: 'The Boy Who Talked to Clouds',
      tagline: 'In Cherrapunji, where it rains more than anywhere on Earth, a boy discovers why clouds are always giving.',
      content: `In **Cherrapunji**, in the hills of Meghalaya, it rains almost every day. A boy named **Bah Kit** always wondered why. One morning, he climbed to a rocky ledge and reached into a cloud.

"Why are you always crying?" he asked.

*"I'm not crying. I'm giving. Water. The rivers need it. The trees need it. Even you drank some this morning."*

"Don't you get tired of giving?"

*"Sometimes. Sometimes I wish someone would give something to me."*

"What do you want?"

*"Company."*

Bah Kit sat inside the cloud and listened to its journey — from the Bay of Bengal, over Bangladesh, hitting the Khasi Hills where cool air squeezed the water out like wringing a towel.

From that day on, the rain in Cherrapunji fell softer. As if it knew someone cared.`,
    },
    stem: {
      title: 'Meteorology & Climate',
      description: 'Why does Cherrapunji get 12,000mm of rain per year? How do clouds form, travel, and release water? This lesson explores weather science through the wettest place on Earth.',
      icon: Cloud,
      color: 'from-sky-400 to-indigo-500',
      skills: [
        'The atmosphere — layers and air pressure — Level 1 — L1-1',
        'Water cycle — evaporation, condensation, rain — Level 1 — L1-3',
        'Cloud types and what they predict — Level 1 — L1-4',
        'Monsoon science — why NE India is so wet — Level 1 — L1-6',
        'Weather data analysis — Level 2 — L2-1',
        'Climate change — CO2 and temperature trends — Level 2 — L2-5',
      ],
      project: { title: 'Build a Weather Station', description: 'Log temperature, humidity, and pressure data using sensors, analyze patterns, and make forecasts.', steps: ['Set up temperature + humidity sensors', 'Log readings every hour for a week', 'Plot temperature vs time — find the daily pattern', 'Correlate humidity with rainfall', 'Make a 24-hour forecast based on trends', 'Compare your forecast to the actual weather'] },
      realWorld: ['Mawsynram (near Cherrapunji) holds the record for wettest place on Earth', 'Weather satellites use infrared cameras to track cloud formation from space', 'Climate models use millions of equations running on supercomputers'],
    },
    illustration: '/content/illustrations/boy-clouds.webp',
    track: 'school',
    playground: 'clouds' as const,
  },
  {
    slug: 'how-majuli-island-was-born',
    story: {
      title: 'How Majuli Island Was Born',
      tagline: 'The world\'s largest river island — created by the Brahmaputra, threatened by it, loved by all.',
      content: `**Majuli** is the largest river island in the world, sitting in the middle of the mighty Brahmaputra. The story says that long ago, the river was a single wide channel. But one monsoon, it swelled so large that it split into two arms, leaving a piece of land between them.

That land became Majuli — home to the **Mishing people**, to ancient **satras** (monasteries), to one-horned rhinos and river dolphins. For centuries, the island was enormous — over 1,200 square kilometers.

But the Brahmaputra that created Majuli is also destroying it. Every year, the river eats away at the edges. The island has shrunk to less than 500 square kilometers. Villages have been swallowed. Fields have become riverbed.

The people of Majuli are fighting back — planting bamboo, building embankments, and asking the world to notice. Because Majuli isn't just an island. It's a civilization that lives on borrowed land.`,
    },
    stem: {
      title: 'Geography & River Dynamics',
      description: 'How does a river create an island? How does erosion threaten it? This lesson explores the geology, hydrology, and conservation challenges of the world\'s largest river island.',
      icon: Mountain,
      color: 'from-teal-400 to-cyan-500',
      skills: [
        'Rivers — erosion and deposition — Level 1 — L1-1',
        'Sediment transport — what rivers carry — Level 1 — L1-2',
        'River island formation — Level 1 — L1-3',
        'Majuli\'s erosion data — real measurements — Level 1 — L1-5',
        'Satellite imagery analysis — Level 2 — L2-4',
        'Engineering solutions for erosion — Level 2 — L2-6',
      ],
      project: { title: 'Map Erosion Over Time', description: 'Analyze satellite images of Majuli from different years to measure how much land has been lost.', steps: ['Find satellite images of Majuli (1990, 2000, 2010, 2020)', 'Trace the island boundary in each image', 'Calculate area change per decade', 'Identify the most eroded sections', 'Research what protection measures exist', 'Propose a conservation plan based on data'] },
      realWorld: ['Majuli has lost over 50% of its area since 1950 — documented by satellite', 'The Brahmaputra carries 600 million tonnes of sediment annually — one of the highest in the world', 'Bangladesh faces similar challenges — riverbank erosion displaces 100,000+ people per year'],
    },
    illustration: '/content/illustrations/majuli-born.webp',
    track: 'school',
    playground: 'majuli' as const,
  },
  {
    slug: 'bamboo-flute-of-nagaland',
    story: {
      title: 'The Bamboo Flute of Nagaland',
      tagline: 'A boy carves a flute from forest bamboo and discovers that music lives inside the wood.',
      content: `In the hills of **Nagaland**, where bamboo forests cover the mountains like green fur, a boy named **Zapuvisie** found a perfect piece of bamboo — straight, hollow, and singing in the wind.

He carved holes in it with his father's knife, spaced the way his grandfather taught him. When he blew across the top, the bamboo sang — not his song, but the song of the forest. The wind in the trees, the birds in the morning, the river over stones.

His grandfather said: "The music was always inside the bamboo. You just let it out."

Zapuvisie played his flute every evening, and the village gathered to listen. Each hole he covered changed the note. Each breath he gave changed the mood. The same bamboo tube could sound like laughter or like rain.

"How does the same tube make different sounds?" he asked his grandfather.

"The air inside is learning new shapes," said the old man. And he was right — though he didn't know it was called physics.`,
    },
    stem: {
      title: 'Acoustics & Sound',
      description: 'How does a hollow bamboo tube make music? Why do different holes produce different notes? This lesson explores the physics of sound — waves, frequency, resonance, and musical scales.',
      icon: Music,
      color: 'from-purple-400 to-fuchsia-500',
      skills: [
        'Sound as pressure waves — Level 1 — L1-1',
        'Frequency and pitch — Level 1 — L1-2',
        'Resonance — why tubes sing — Level 1 — L1-3',
        'Harmonics — timbre and tone color — Level 1 — L1-4',
        'Digital audio — generating sound in code — Level 2 — L2-1',
        'FFT — decomposing complex sounds — Level 2 — L2-3',
      ],
      project: { title: 'Build a Digital Flute', description: 'Create a program that generates flute-like tones at different frequencies — a virtual bamboo flute.', steps: ['Generate pure sine tones at musical note frequencies', 'Add harmonics to make it sound like a flute (not a beep)', 'Map keyboard keys to notes (a simple synthesizer)', 'Add a reverb effect using delay lines', 'Play a simple melody programmatically', 'Compare your digital flute to a recording of a real bamboo flute'] },
      realWorld: ['Auto-Tune uses FFT to detect and correct vocal pitch in real time', 'Noise-cancelling headphones generate inverse sound waves to cancel noise', 'Musical instrument digital interface (MIDI) standardized electronic music in 1983'],
    },
    illustration: '/content/illustrations/bamboo-flute.webp',
    track: 'school',
    playground: 'bamboo-flute' as const,
  },
  {
    slug: 'dancing-deer-of-loktak-lake',
    story: {
      title: 'The Dancing Deer of Loktak Lake',
      tagline: 'On floating islands in Manipur, the last sangai deer dance at dawn — fewer than 300 remain.',
      content: `In **Manipur**, there is a lake unlike any other. **Loktak Lake** is covered with floating islands called **phumdis** — thick mats of vegetation, soil, and organic matter that drift across the water. On these floating islands lives the **sangai** — the brow-antlered deer, found nowhere else on Earth.

The sangai is called the "dancing deer" because of the way it walks on the soft, floating phumdis — each step a careful, graceful movement, as if it's dancing on water. Fewer than **300 sangai** remain in the wild.

The lake is shrinking. The phumdis are thinning. Pollution and a dam have changed the water levels. The sangai's floating world is sinking beneath them.

But the people of Manipur haven't given up. Keibul Lamjao National Park — the world's only floating national park — protects the sangai's last habitat. Scientists, rangers, and local communities work together to save the dancing deer.

Because some dances are too beautiful to lose.`,
    },
    stem: {
      title: 'Ecology & Conservation',
      description: 'Why is the sangai endangered? What makes a wetland ecosystem work? This lesson explores food chains, biodiversity, population dynamics, and the science of saving species.',
      icon: TreePine,
      color: 'from-green-400 to-emerald-500',
      skills: [
        'Ecosystems — living and non-living interactions — Level 1 — L1-1',
        'Food chains and energy flow — Level 1 — L1-2',
        'Wetland ecology — why wetlands matter — Level 1 — L1-3',
        'Biodiversity measurement — Level 1 — L1-4',
        'Population dynamics — growth and decline — Level 2 — L2-1',
        'Conservation strategies — protected areas and community — Level 2 — L2-6',
      ],
      project: { title: 'Species Conservation Plan', description: 'Analyze population data, model growth scenarios, and propose a conservation strategy for an endangered species.', steps: ['Research current sangai population data', 'Model population growth with and without protection', 'Identify threats: habitat loss, poaching, climate', 'Calculate minimum viable population size', 'Design a conservation plan with measurable goals', 'Present findings as a scientific poster'] },
      realWorld: ['The sangai population dropped to ~14 in the 1970s — conservation brought it back to ~300', 'Wetlands cover 6% of Earth\'s surface but contain 40% of all species', 'India has 75 Ramsar wetland sites — Loktak Lake is one of them'],
    },
    illustration: '/content/illustrations/dancing-deer.webp',
    track: 'school',
    playground: 'dancing-deer' as const,
  },
  {
    slug: 'bridge-that-grew',
    story: {
      title: 'The Bridge That Grew',
      tagline: 'In Meghalaya, the Khasi people grow bridges from living tree roots — engineering that takes decades but lasts centuries.',
      content: `In the rainforests of **Meghalaya**, where rivers swell to torrents in the monsoon and wooden bridges rot in a single season, the **Khasi people** found a solution that takes patience but lasts forever: they grow their bridges.

They guide the roots of the **Ficus elastica** (rubber fig tree) across rivers using bamboo scaffolding and hollowed-out betel nut trunks. The roots grow, thicken, and intertwine over **15 to 20 years** until they form a bridge strong enough to hold 50 people at once.

These **living root bridges** get stronger with age. Some are over **500 years old** and still in use. They don't rust, don't rot (they're alive), and they repair themselves when damaged.

The most famous is the **double-decker root bridge** at Nongriat village — two bridges stacked on top of each other, both grown from living roots.

In an age of steel and concrete, the Khasi people remind us that sometimes the best engineering is patient, alive, and rooted in the earth.`,
    },
    stem: {
      title: 'Bio-engineering & Structures',
      description: 'How can a living tree become a bridge? What forces act on a bridge? This lesson explores structural engineering, materials science, and the revolutionary field of bio-engineering.',
      icon: Construction,
      color: 'from-orange-400 to-red-500',
      skills: [
        'Forces — compression, tension, and balance — Level 1 — L1-1',
        'Bridge types — beam, arch, suspension, root — Level 1 — L1-2',
        'Materials comparison — steel, wood, roots — Level 1 — L1-3',
        'Load distribution and stress — Level 1 — L1-4',
        'Structural analysis — free body diagrams — Level 2 — L2-1',
        'Designing for safety — factors of safety — Level 2 — L2-4',
      ],
      project: { title: 'Design a Bridge', description: 'Design, model, and test a bridge structure — compare materials, calculate loads, and optimize for strength.', steps: ['Calculate forces on a simple beam bridge', 'Build a model bridge from craft sticks or spaghetti', 'Test to failure — measure the maximum load', 'Compare beam vs. arch vs. truss designs', 'Calculate the safety factor of your best design', 'Research how living root bridges compare to engineered ones'] },
      realWorld: ['Living root bridges self-repair and strengthen over time — no maintenance needed', 'The Golden Gate Bridge requires 40 full-time painters working year-round', 'Biomimetic architecture is growing structures using mycelium (mushroom roots)'],
    },
    illustration: '/content/illustrations/bridge-grew.webp',
    track: 'school',
    playground: 'bridge' as const,
  },
];

export function getLessonBySlug(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}
