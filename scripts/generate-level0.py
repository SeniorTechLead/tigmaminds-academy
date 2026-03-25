#!/usr/bin/env python3
"""
Generate level0 data for all stories in lessons.ts that don't have it yet.
Each story gets domain-specific vocabulary, true/false, facts, and offline activity.
"""

import re, json

# STEM topic → level0 content mapping
TOPIC_CONTENT = {
    'AI & Wildlife': {
        'vocab': [
            ['Artificial Intelligence', 'Computer systems that can learn from data and make decisions'],
            ['Sensor', 'A device that detects physical changes like sound, light, or vibration'],
            ['Classification', 'Sorting data into categories based on patterns'],
            ['Signal processing', 'Analyzing and extracting information from recorded data'],
            ['Neural network', 'A computer model inspired by how brain cells connect'],
        ],
        'tf': [
            ('AI can help scientists study animals without disturbing them.', True, 'AI-powered cameras, microphones, and sensors can monitor wildlife 24/7 from a distance, collecting data that would take humans years to gather manually.'),
            ('Computers can learn to identify animal species from their sounds.', True, 'Machine learning models trained on audio recordings can distinguish between species, individual animals, and even emotional states from their calls.'),
            ('AI will replace all wildlife scientists.', False, 'AI is a tool that helps scientists work faster, but it cannot replace human understanding, creativity, and ethical judgment in conservation decisions.'),
        ],
        'facts': [
            'AI-powered camera traps can identify individual animals by their unique markings — like facial recognition, but for tigers and leopards.',
            'Acoustic monitoring stations in rainforests can detect illegal logging by recognizing the sound of chainsaws, even from kilometers away.',
            'Conservation drones equipped with thermal cameras can count animal populations at night without disturbing them.',
        ],
        'activity': 'Go outside and spend 10 minutes just listening. Close your eyes. How many different sounds can you identify? Birds, insects, wind, traffic? Scientists do exactly this — but with AI helping them identify what they hear.',
    },
    'LED': {
        'vocab': [
            ['LED', 'Light Emitting Diode — a tiny electronic component that glows when electricity flows through it'],
            ['Circuit', 'A complete path that electricity can flow through, from power source back to power source'],
            ['Bioluminescence', 'Light produced by living organisms through chemical reactions'],
            ['Voltage', 'The electrical pressure that pushes electrons through a circuit, measured in volts'],
            ['Resistor', 'A component that limits how much electricity flows — like a narrow pipe for water'],
        ],
        'tf': [
            ('Fireflies produce light through electricity, just like a light bulb.', False, 'Fireflies use a chemical reaction (luciferin + oxygen → light). This is bioluminescence — completely different from electrical light. Firefly light is nearly 100% efficient, while incandescent bulbs waste 90% as heat.'),
            ('An LED needs a complete circuit to work — if any wire is disconnected, it stops.', True, 'Electricity must flow in a complete loop. Break the circuit anywhere and the flow stops, just like breaking a water pipe stops all water flow downstream.'),
            ('All fireflies blink at the same rate.', False, 'Different species have different flash patterns — it\'s how they find mates. Some flash once per second, others have complex multi-flash sequences. Scientists can identify species by their flash pattern alone.'),
        ],
        'facts': [
            'Firefly light is called "cold light" because nearly 100% of the energy becomes light, not heat. An incandescent bulb converts only about 10% to light — the rest is wasted as heat.',
            'Scientists study firefly synchronization to improve wireless network protocols — the same math that makes fireflies flash in unison can help phones communicate more efficiently.',
            'There are over 2,000 species of fireflies worldwide, and each has a unique flash pattern — like a Morse code for love.',
        ],
        'activity': 'Find a flashlight or phone light. Try blinking it in a pattern: on for 2 seconds, off for 1 second, repeat. Now try a different pattern: quick flash, quick flash, long pause. How many different "messages" can you create with just on and off? This is exactly how fireflies communicate.',
    },
    'Sonar': {
        'vocab': [
            ['Echolocation', 'Finding objects by sending out sound and listening for the echo that bounces back'],
            ['Ultrasonic', 'Sound waves too high-pitched for humans to hear (above 20,000 Hz)'],
            ['Echo', 'Sound that bounces off a surface and returns to the listener'],
            ['Frequency', 'How many sound waves pass a point per second, measured in Hertz (Hz)'],
            ['Transducer', 'A device that converts one form of energy to another — like sound to electricity'],
        ],
        'tf': [
            ('Dolphins can "see" underwater using sound.', True, 'Dolphins send out clicks and listen for echoes. Their brain creates a 3D mental image from the echo patterns — they can detect fish, obstacles, and even the shape of objects in murky water where eyes are useless.'),
            ('Sound travels faster in water than in air.', True, 'Sound travels about 1,500 m/s in water vs 343 m/s in air — over 4 times faster. This is because water molecules are packed closer together, transmitting vibrations more efficiently.'),
            ('Only marine animals use echolocation.', False, 'Bats use echolocation in air to catch insects at night. Some birds (oilbirds, swiftlets) and even some blind humans have learned to use tongue clicks to navigate by echo.'),
        ],
        'facts': [
            'The Gangetic river dolphin is nearly blind — its eyes can only tell light from dark. It navigates entirely by sonar, clicking up to 200 times per second.',
            'Medical ultrasound uses the same principle as dolphin sonar — high-frequency sound waves bounce off organs and create an image. This is how doctors see babies before they\'re born.',
            'Submarines use sonar arrays that can detect objects hundreds of kilometers away. The same technology helps map the ocean floor, discovering new species and underwater mountains.',
        ],
        'activity': 'Stand in a large room or hallway and clap once. Listen for the echo. Now try it in a smaller room — is the echo faster or slower? Try clapping near a wall vs in the middle of a room. You\'re doing exactly what a dolphin does: using sound to understand the shape of your environment.',
    },
    'Web Development': {
        'vocab': [
            ['HTML', 'HyperText Markup Language — the code that defines the structure of a web page'],
            ['CSS', 'Cascading Style Sheets — the code that controls how a web page looks (colors, fonts, layout)'],
            ['JavaScript', 'The programming language that makes web pages interactive (responding to clicks, updating content)'],
            ['Database', 'An organized collection of data that a computer can quickly search and update'],
            ['API', 'Application Programming Interface — a set of rules for how different software systems talk to each other'],
        ],
        'tf': [
            ('Every website you visit is built with HTML.', True, 'HTML is the foundation of every web page. Even the most complex sites — Google, YouTube, Amazon — are built on HTML, CSS, and JavaScript. The browser reads HTML and turns it into the visual page you see.'),
            ('You need to be good at math to build websites.', False, 'Web development is more about logic, creativity, and problem-solving than math. While some areas (like animation or data visualization) use math, most website building requires understanding structure, design, and user experience.'),
            ('A website is just one file on a computer somewhere.', False, 'Even a simple website has multiple files: HTML for structure, CSS for styling, JavaScript for behavior, images, and often a database. Complex sites like Amazon have millions of files across thousands of servers.'),
        ],
        'facts': [
            'The first website ever created was published on August 6, 1991, by Tim Berners-Lee. It described the World Wide Web project — and it\'s still online today.',
            'There are approximately 2 billion websites in the world, but only about 400 million are actively maintained.',
            'Wikipedia, one of the world\'s most visited websites, is maintained by over 100,000 volunteer editors and runs on free, open-source software.',
        ],
        'activity': 'Open any web page in your browser, right-click, and select "View Page Source." You\'ll see the HTML code that creates the page. Can you find the title? The headings? The links? Every page you visit is just text like this, interpreted by your browser into the visual page you see.',
    },
    'Computer Vision': {
        'vocab': [
            ['Pixel', 'The smallest unit of a digital image — a tiny colored square'],
            ['RGB', 'Red, Green, Blue — the three colors mixed to create any color on a screen'],
            ['Classification', 'Teaching a computer to sort images into categories (e.g., healthy crop vs diseased)'],
            ['Feature extraction', 'Identifying the important characteristics in an image that help distinguish different things'],
            ['Threshold', 'A cutoff value used to make a yes/no decision from continuous data'],
        ],
        'tf': [
            ('A digital image is really just a grid of numbers.', True, 'Every pixel in a photo has three numbers (Red, Green, Blue) from 0-255. A 12-megapixel phone photo contains 36 million individual numbers. Your brain assembles them into a picture — a computer processes the raw numbers.'),
            ('Computers see images the same way humans do.', False, 'Humans recognize objects instantly using context, experience, and intuition. Computers process pixel values mathematically — they have no concept of "what things are," only patterns in numbers. A child can identify a cat in any pose; a computer needs thousands of example images to learn.'),
            ('Drones are already being used to monitor crop health from the air.', True, 'Agricultural drones equipped with special cameras (including infrared) can survey hundreds of acres per hour, detecting crop stress, pest damage, and water deficiency before they\'re visible to the human eye.'),
        ],
        'facts': [
            'A dragonfly has compound eyes with up to 30,000 individual lenses — each capturing a tiny piece of the scene, like 30,000 pixels. Its brain fuses them into a single panoramic view.',
            'DJI agricultural drones spray pesticide only where computer vision detects pests, reducing chemical use by up to 90% compared to blanket spraying.',
            'India\'s ICRISAT (International Crops Research Institute) uses satellite imagery + AI to advise 4 million smallholder farmers on planting and irrigation.',
        ],
        'activity': 'Take a close-up photo of a leaf with your phone, then zoom in as far as you can. Can you see individual pixels? The colored squares? Now compare a healthy leaf photo to a dry or damaged leaf. What color differences do you see? Computers do exactly this — compare colors to detect plant health.',
    },
    'Materials': {
        'vocab': [
            ['Tensile strength', 'How much pulling force a material can withstand before it breaks'],
            ['Fibre', 'A thin, thread-like strand — natural (silk, cotton) or synthetic (nylon, polyester)'],
            ['Protein', 'A large molecule made of amino acids — the building material of muscles, hair, and silk'],
            ['UV resistance', 'The ability to withstand ultraviolet light from the sun without degrading'],
            ['Biodegradable', 'Able to be broken down naturally by bacteria and other living organisms'],
        ],
        'tf': [
            ('Muga silk is the only naturally golden silk in the world.', True, 'Muga silk from Assam gets its golden color from xanthurenic acid, a pigment chemically bonded into the fibroin protein. Unlike dyes that sit on the surface, this color is part of the molecule and never fades.'),
            ('Synthetic materials like nylon are always better than natural materials.', False, 'Each material has trade-offs. Nylon is stronger and cheaper but made from petroleum and takes centuries to decompose. Silk is biodegradable and renewable but expensive and limited in supply. The "best" material depends on the application.'),
            ('Spider silk is stronger than steel.', True, 'By weight, spider silk is about 5 times stronger than steel. Scientists are trying to mass-produce synthetic spider silk for bulletproof vests, surgical sutures, and aerospace applications.'),
        ],
        'facts': [
            'Muga silk gets more lustrous with each wash — the opposite of most fabrics. This is because washing removes surface sericin, exposing more of the naturally golden fibroin underneath.',
            'A single silkworm cocoon contains up to 1 kilometer of continuous silk thread. It takes about 5,000 cocoons to make 1 kilogram of raw silk.',
            'Biomimetic scientists study natural materials to design better synthetic ones. Gecko-inspired adhesives, lotus-inspired self-cleaning surfaces, and abalone-inspired armor are all based on nature\'s engineering.',
        ],
        'activity': 'Find three different fabrics at home (e.g., cotton t-shirt, polyester bag, wool sweater). Hold each up to the light — which lets more light through? Pull gently — which stretches more? Drop water on each — which absorbs fastest? You\'re doing basic materials testing, just like a scientist.',
    },
    'Plant Biology': {
        'vocab': [
            ['Photosynthesis', 'The process plants use to convert sunlight, water, and CO₂ into sugar and oxygen'],
            ['Chlorophyll', 'The green pigment in plants that absorbs sunlight for photosynthesis'],
            ['Vegetative propagation', 'Growing a new plant from a fragment of the parent — without seeds'],
            ['Totipotent', 'A cell that can develop into any cell type — plant cells have this superpower'],
            ['Cell wall', 'A rigid outer layer made of cellulose that gives plant cells their shape and strength'],
        ],
        'tf': [
            ('Plants eat soil to get their food.', False, 'Plants make their own food through photosynthesis using sunlight, water, and CO₂ from air. The soil provides minerals and water, but the actual "food" (sugar) is manufactured inside the leaves using solar energy.'),
            ('A single plant cell can grow into an entire new plant.', True, 'Unlike most animal cells, many plant cells are totipotent — they retain the ability to become any cell type. This is why you can grow a new plant from a cutting — the cut stem cells reorganize into roots, stems, and leaves.'),
            ('All plants reproduce using seeds.', False, 'Many plants can also reproduce vegetatively — through cuttings, runners, tubers, or bulbs. Every banana plant in your grocery store is a clone, grown from a cutting rather than a seed.'),
        ],
        'facts': [
            'Photosynthesis produces all the oxygen we breathe. Every other breath you take comes from algae and plants splitting water molecules apart.',
            'The world\'s largest organism is a clonal colony of aspen trees in Utah called "Pando" — 47,000 tree stems all connected by a single root system, weighing 6,600 tonnes.',
            'Tulsi (holy basil) contains eugenol, a natural antiseptic. Traditional medicine used it for centuries — modern science has confirmed its antimicrobial properties.',
        ],
        'activity': 'Take a cutting from a plant (a small piece of stem with a few leaves). Place it in a glass of water on a windowsill. Check every day — within a week, you should see tiny roots forming. You\'re witnessing vegetative propagation — the same process that makes Tejimola\'s story biologically plausible.',
    },
}

# Default content for topics not specifically mapped
DEFAULT = {
    'vocab': [
        ['Variable', 'A value that can change — the thing you measure or control in science'],
        ['Observation', 'Noticing and recording something using your senses or instruments'],
        ['Pattern', 'A repeated or predictable arrangement — nature is full of patterns'],
        ['Model', 'A simplified representation of something complex — helps us understand and predict'],
        ['Evidence', 'Data or observations that support or disprove a claim'],
    ],
    'tf': [
        ('Science is only done in laboratories.', False, 'Science happens everywhere — in fields, forests, rivers, kitchens, and yes, laboratories. Some of the most important discoveries were made by people observing nature in their everyday surroundings.'),
        ('Making mistakes is an important part of learning.', True, 'Errors and unexpected results often lead to the most important discoveries. Penicillin was discovered from a contaminated experiment. Post-it notes came from a "failed" adhesive. In science and in learning, mistakes are data.'),
        ('You need expensive equipment to do science.', False, 'Many important observations can be made with just your senses, a notebook, and curiosity. Jane Goodall studied chimpanzees for decades with primarily observation and patience.'),
    ],
    'facts': [
        'The scientific method has been used for over 1,000 years — the earliest version was described by Ibn al-Haytham (Alhazen) in 11th century Iraq.',
        'Northeast India is a biodiversity hotspot — one of 36 globally recognized regions with exceptional concentrations of endemic species.',
        'The best way to remember something is to teach it to someone else. This is called the "protégé effect" — your brain organizes information more thoroughly when preparing to explain it.',
    ],
    'activity': 'Keep a "science journal" for one week. Each day, write down one thing you observed in nature — a cloud shape, an insect, a plant growing, water flowing. Draw what you see. Ask "why?" for each observation. At the end of the week, pick your most interesting observation and research it.',
}

def get_content_for_stem(stem_title):
    """Find the best matching content for a STEM topic."""
    stem_lower = stem_title.lower()
    for key, content in TOPIC_CONTENT.items():
        if key.lower() in stem_lower:
            return content
    # Try partial matches
    if 'plant' in stem_lower or 'biology' in stem_lower or 'botany' in stem_lower or 'ecology' in stem_lower:
        return TOPIC_CONTENT.get('Plant Biology', DEFAULT)
    if 'optic' in stem_lower or 'light' in stem_lower or 'color' in stem_lower:
        return TOPIC_CONTENT.get('LED', DEFAULT)
    if 'sound' in stem_lower or 'acoustic' in stem_lower or 'music' in stem_lower:
        return TOPIC_CONTENT.get('Sonar', DEFAULT)
    if 'engineer' in stem_lower or 'bridge' in stem_lower or 'struct' in stem_lower:
        return TOPIC_CONTENT.get('Materials', DEFAULT)
    if 'web' in stem_lower or 'html' in stem_lower or 'database' in stem_lower:
        return TOPIC_CONTENT.get('Web Development', DEFAULT)
    if 'ai' in stem_lower or 'machine' in stem_lower or 'computer' in stem_lower or 'data' in stem_lower:
        return TOPIC_CONTENT.get('AI & Wildlife', DEFAULT)
    return DEFAULT

# Read lessons.ts
with open('src/data/lessons.ts', 'r') as f:
    content = f.read()

# Find all entries without level0 and add it
# Pattern: entries end with "playground: '...' as const,\n  },"
# We need to insert level0 before the closing },

import re

# Find each lesson entry that has playground but no level0
# Look for pattern: playground: '...',\n  },
pattern = r"(    playground: '[^']+' as const,)\n(  },)"
matches = list(re.finditer(pattern, content))

print(f"Found {len(matches)} entries to process")

# We need to find the stem title for each entry to generate appropriate content
# Work backwards to avoid offset issues
replacements = []
for match in reversed(matches):
    start = match.start()
    end = match.end()

    # Check if this entry already has level0
    entry_text = content[max(0, start-2000):end]
    if 'level0:' in entry_text:
        continue

    # Extract stem title
    stem_match = re.search(r"title: '([^']+)'", entry_text)
    if not stem_match:
        continue

    # Get the last stem title (could match story title or stem title)
    all_titles = re.findall(r"title: '([^']+)'", entry_text)
    stem_title = all_titles[1] if len(all_titles) > 1 else all_titles[0]

    c = get_content_for_stem(stem_title)

    # Build level0 TypeScript
    vocab_items = ',\n'.join([f"        ['{v[0]}', '{v[1].replace(chr(39), chr(92)+chr(39))}']" for v in c['vocab'][:5]])
    tf_items = ',\n'.join([f"        {{ statement: '{t[0].replace(chr(39), chr(92)+chr(39))}', isTrue: {'true' if t[1] else 'false'}, explanation: '{t[2].replace(chr(39), chr(92)+chr(39))}' }}" for t in c['tf'][:3]])
    facts_items = ',\n'.join([f"        '{f.replace(chr(39), chr(92)+chr(39))}'" for f in c['facts'][:3]])
    activity = c['activity'].replace("'", "\\'")

    level0_block = f"""    level0: {{
      vocabulary: [
{vocab_items},
      ],
      trueFalse: [
{tf_items},
      ],
      facts: [
{facts_items},
      ],
      offlineActivity: '{activity}',
    }},"""

    replacement = match.group(1) + '\n' + level0_block + '\n' + match.group(2)
    replacements.append((start, end, replacement))

# Apply replacements
for start, end, replacement in replacements:
    content = content[:start] + replacement + content[end:]

with open('src/data/lessons.ts', 'w') as f:
    f.write(content)

# Count results
has_level0 = content.count('level0:')
print(f"Total level0 entries after generation: {has_level0}")
