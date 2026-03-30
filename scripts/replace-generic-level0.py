#!/usr/bin/env python3
"""
Replace generic placeholder level0 content with story-specific content
for 21 stories in lessons.ts.
"""

import re

LESSONS_FILE = 'src/data/lessons.ts'

# Generic level0 block pattern - the exact text we need to find and replace
GENERIC_LEVEL0 = """    level0: {
      vocabulary: [
        ['Observation', 'Noticing and recording something carefully'],
        ['Pattern', 'A repeated arrangement in nature or data'],
        ['Variable', 'Something that can change or be measured'],
        ['Evidence', 'Data supporting or disproving a claim'],
        ['Model', 'A simplified version of something complex'],
      ],
      trueFalse: [
        { statement: 'Science only happens in laboratories.', isTrue: false, explanation: 'Science happens everywhere — forests, kitchens, rivers, playgrounds.' },
        { statement: 'Making mistakes helps you learn.', isTrue: true, explanation: 'Errors lead to discoveries. Penicillin was found from a contaminated experiment.' },
        { statement: 'You need expensive equipment for science.', isTrue: false, explanation: 'Curiosity and observation are the most important scientific tools.' },
      ],
      facts: [
        'NE India is one of 36 global biodiversity hotspots.',
        'The scientific method has been used for over 1,000 years.',
        'Teaching someone else is the best way to check understanding.',
      ],
      offlineActivity: 'Keep a nature journal for one week. Each day, draw and describe one observation. At the end, research your most interesting one.',
    },"""

# Also check for the slightly different format used in earlier stories
GENERIC_LEVEL0_ALT = """    level0: {
      vocabulary: [
        ['Variable', 'A value that can change — the thing you measure or control in science'],
        ['Observation', 'Noticing and recording something using your senses or instruments'],
        ['Pattern', 'A repeated or predictable arrangement — nature is full of patterns'],
        ['Model', 'A simplified representation of something complex — helps us understand and predict'],
        ['Evidence', 'Data or observations that support or disprove a claim'],
      ],
      trueFalse: [
        { statement: 'Science is only done in laboratories.', isTrue: false, explanation: 'Science happens everywhere — in fields, forests, rivers, kitchens, and yes, laboratories. Some of the most important discoveries were made by people observing nature in their everyday surroundings.' },
        { statement: 'Making mistakes is an important part of learning.', isTrue: true, explanation: 'Errors and unexpected results often lead to the most important discoveries. Penicillin was discovered from a contaminated experiment. Post-it notes came from a "failed" adhesive. In science and in learning, mistakes are data.' },
        { statement: 'You need expensive equipment to do science.', isTrue: false, explanation: 'Many important observations can be made with just your senses, a notebook, and curiosity. Jane Goodall studied chimpanzees for decades with primarily observation and patience.' },
      ],
      facts: [
        'The scientific method has been used for over 1,000 years — the earliest version was described by Ibn al-Haytham (Alhazen) in 11th century Iraq.',
        'Northeast India is a biodiversity hotspot — one of 36 globally recognized regions with exceptional concentrations of endemic species.',
        'The best way to remember something is to teach it to someone else. This is called the "protégé effect" — your brain organizes information more thoroughly when preparing to explain it.',
      ],
      offlineActivity: 'Keep a "science journal" for one week. Each day, write down one thing you observed in nature — a cloud shape, an insect, a plant growing, water flowing. Draw what you see. Ask "why?" for each observation. At the end of the week, pick your most interesting observation and research it.',
    },"""

# Custom level0 content for each story
CUSTOM_LEVEL0 = {}

CUSTOM_LEVEL0['snow-leopards-promise'] = """    level0: {
      vocabulary: [
        ['Altitude', 'Height above sea level — as altitude increases, air pressure and oxygen levels drop'],
        ['Adaptation', 'A physical or behavioral trait that helps an organism survive in its environment'],
        ['Hemoglobin', 'The protein in red blood cells that carries oxygen — mountain animals often have more of it'],
        ['Camouflage', 'Coloring or patterns that help an animal blend into its surroundings to avoid detection'],
        ['Thermoregulation', 'How an organism maintains its body temperature despite external conditions'],
      ],
      trueFalse: [
        { statement: 'Snow leopards roar like other big cats.', isTrue: false, explanation: 'Snow leopards cannot roar. They lack the flexible larynx that lions and tigers have. Instead, they make chuffing, hissing, and mewing sounds. They are sometimes called the ghost of the mountains because of their silent nature.' },
        { statement: 'Air gets thinner as you go higher up a mountain.', isTrue: true, explanation: 'At higher altitudes, atmospheric pressure drops and there are fewer oxygen molecules per breath. At the top of Mount Everest, each breath contains only about one-third the oxygen available at sea level. Animals living at high altitude have adapted to extract oxygen more efficiently.' },
        { statement: 'A snow leopard\\'s tail is just for balance.', isTrue: false, explanation: 'While the tail does help with balance on rocky terrain, it serves another critical purpose — warmth. Snow leopards wrap their thick, furry tails around their nose and mouth while sleeping to warm the air they breathe in temperatures as low as minus 40 degrees.' },
      ],
      facts: [
        'Snow leopards can leap up to 15 metres in a single bound — six times their body length. This explosive power comes from exceptionally strong hind legs adapted to navigating steep, rocky mountain terrain.',
        'There are estimated to be only 4,000 to 6,500 snow leopards left in the wild, spread across 12 countries in Central and South Asia including the Indian Himalayas in Sikkim and Arunachal Pradesh.',
        'At 5,000 metres altitude, water boils at about 83 degrees Celsius instead of 100, because lower air pressure means water molecules escape into steam more easily. This is why cooking takes longer at high altitude.',
      ],
      offlineActivity: 'Fill a plastic bag with air at ground level and seal it. Then take it to the highest floor of a building or a hilltop. Notice how the bag puffs up — the air inside expands because the outside pressure is lower. This demonstrates how air pressure decreases with altitude, the same physics that makes mountain life challenging for animals.',
    },"""

CUSTOM_LEVEL0['old-banyan-trees-stories'] = """    level0: {
      vocabulary: [
        ['Aerial root', 'A root that grows from a branch down toward the ground, eventually becoming a new trunk'],
        ['Epiphyte', 'A plant that grows on another plant for support but is not a parasite — it makes its own food'],
        ['Photosynthesis', 'The process by which green plants convert sunlight, water, and carbon dioxide into food and oxygen'],
        ['Canopy', 'The uppermost layer of branches and leaves in a forest or a single large tree'],
        ['Symbiosis', 'A close relationship between two different species that live together, often benefiting both'],
      ],
      trueFalse: [
        { statement: 'A single banyan tree can look like an entire forest.', isTrue: true, explanation: 'Banyan trees grow aerial roots from their branches that descend to the ground and thicken into secondary trunks. The Great Banyan in Kolkata\\'s botanical garden has over 3,600 aerial roots and covers about 14,500 square metres — larger than many city blocks.' },
        { statement: 'Trees stop growing after they reach a certain age.', isTrue: false, explanation: 'Unlike animals, trees have no genetically programmed maximum size. They continue growing throughout their lives, adding new wood each year. A tree dies from disease, damage, or environmental stress — not from old age in the way animals do.' },
        { statement: 'The oldest living trees are less than 1,000 years old.', isTrue: false, explanation: 'Some bristlecone pine trees in California are over 4,800 years old — they were already ancient when the Egyptian pyramids were built. Banyan trees in India have been dated at 500 or more years, and clonal tree colonies can be thousands of years old.' },
      ],
      facts: [
        'The banyan is India\\'s national tree. The word "banyan" comes from "banias" — Indian traders who conducted business in the shade of these massive trees, a tradition thousands of years old.',
        'A single large banyan tree can provide habitat for over 100 species of birds, insects, and mammals. The figs it produces are a keystone food source — if the banyan disappears, dozens of species lose their primary food supply.',
        'Trees communicate through underground fungal networks called mycorrhizae. A mature tree can send nutrients to a struggling seedling through these networks — scientists call it the "wood wide web."',
      ],
      offlineActivity: 'Find the largest tree near your home. Measure its trunk circumference with a string, then measure the string. Estimate the canopy diameter by pacing underneath it. Count how many different organisms you can spot living on or near it — birds, insects, moss, lichens, other plants. You are conducting a mini biodiversity survey of a single tree\\'s ecosystem.',
    },"""

CUSTOM_LEVEL0['honey-hunters-lesson'] = """    level0: {
      vocabulary: [
        ['Pollination', 'The transfer of pollen from one flower to another, enabling plants to reproduce — bees are key pollinators'],
        ['Colony', 'A group of organisms of the same species living and working together — a bee colony can have 60,000 members'],
        ['Pheromone', 'A chemical signal released by an animal that triggers a response in others of the same species'],
        ['Nectar', 'A sweet liquid produced by flowers to attract pollinators — bees convert nectar into honey through enzymatic processing'],
        ['Sustainable harvesting', 'Taking resources from nature at a rate that allows the source to regenerate and continue producing'],
      ],
      trueFalse: [
        { statement: 'Honey never spoils if stored properly.', isTrue: true, explanation: 'Archaeologists found 3,000-year-old honey in Egyptian tombs that was still edible. Honey\\'s low moisture content, acidic pH, and natural hydrogen peroxide production make it inhospitable to bacteria and fungi.' },
        { statement: 'Bees visit only one type of flower per foraging trip.', isTrue: true, explanation: 'This behavior is called flower constancy. A bee that starts collecting from mango blossoms will visit only mango blossoms on that trip, even if other flowers are closer. This makes bees exceptionally effective pollinators because they transfer pollen between flowers of the same species.' },
        { statement: 'A bee sting is always dangerous to humans.', isTrue: false, explanation: 'For most people, a bee sting causes temporary pain and swelling. It is only dangerous for the roughly 1-2% of people who are allergic to bee venom. For bees, however, stinging is fatal — the stinger pulls out their internal organs.' },
      ],
      facts: [
        'A single honeybee produces only about one-twelfth of a teaspoon of honey in its entire lifetime. That jar of honey on your shelf represents the life\\'s work of hundreds of bees who collectively flew the equivalent of three trips around Earth to produce it.',
        'Bees perform a "waggle dance" to communicate the direction and distance of food sources to other bees. The angle of the dance relative to the sun indicates direction, and the duration indicates distance — it is essentially a GPS system encoded in body movement.',
        'One-third of all the food humans eat depends on bee pollination — including apples, almonds, blueberries, cucumbers, and coffee. If bees disappeared, the global food system would face a crisis within years.',
      ],
      offlineActivity: 'Go outside and watch a flowering plant for 15 minutes. Count how many different insects visit it. Note which part of the flower each insect touches. Do they visit the same type of flower repeatedly, or hop between different types? You are observing pollination ecology — the same science that traditional honey hunters understand intuitively.',
    },"""

CUSTOM_LEVEL0['cuckoo-calls-dawn'] = """    level0: {
      vocabulary: [
        ['Circadian rhythm', 'An internal biological clock that follows a roughly 24-hour cycle, controlling when organisms sleep, wake, and are active'],
        ['Photoperiodism', 'An organism\\'s response to the length of day and night — many plants and animals use day length to time seasonal behaviors'],
        ['Brood parasite', 'An organism that lays its eggs in another species\\' nest, tricking the host into raising its young — cuckoos are famous for this'],
        ['Melatonin', 'A hormone produced in darkness that signals the body it is time to sleep — light suppresses its production'],
        ['Biological clock', 'An internal mechanism that regulates the timing of biological processes without external cues'],
      ],
      trueFalse: [
        { statement: 'Cuckoos raise their own chicks.', isTrue: false, explanation: 'Most cuckoo species are brood parasites — they lay their eggs in the nests of other bird species. The host bird raises the cuckoo chick as its own, often not realizing the deception even when the cuckoo chick grows much larger than the foster parents.' },
        { statement: 'Your body has an internal clock even without sunlight.', isTrue: true, explanation: 'Experiments in caves and underground bunkers show that humans maintain a roughly 24-hour sleep-wake cycle even without sunlight or clocks. The suprachiasmatic nucleus in the brain acts as the master clock, though it drifts slightly without light cues.' },
        { statement: 'All birds sing at the same time of day.', isTrue: false, explanation: 'Different bird species sing at specific times — this is called the "dawn chorus." Birds with larger eyes tend to sing earlier because they can see better in low light. The sequence is remarkably consistent day after day, like a natural orchestra following a timetable.' },
      ],
      facts: [
        'The dawn chorus — birds singing at sunrise — follows a predictable order based on eye size. Robins and blackbirds (large eyes) start first in near-darkness, followed by wrens and warblers as light increases. Scientists can estimate the time by which species are singing.',
        'Jet lag happens because your circadian rhythm is stuck on your old time zone. It takes roughly one day per time zone crossed for your biological clock to fully reset — this is why east-west travel feels more disorienting than north-south travel.',
        'Some plants have circadian rhythms too. The leaves of prayer plants fold up at night and open during the day, even when kept in constant darkness — their internal clock remembers the day-night cycle.',
      ],
      offlineActivity: 'For three mornings in a row, step outside just before sunrise and listen carefully. Note which birds you hear first, second, and third. Record the time for each. Do you hear the same sequence each day? You are documenting the dawn chorus — a biological clock phenomenon that ornithologists study worldwide.',
    },"""

CUSTOM_LEVEL0['orchid-colors'] = """    level0: {
      vocabulary: [
        ['Pigment', 'A substance that gives color by absorbing certain wavelengths of light and reflecting others'],
        ['Anthocyanin', 'A plant pigment responsible for red, purple, and blue colors in flowers, fruits, and leaves'],
        ['Speciation', 'The process by which one species evolves into two or more distinct species over time'],
        ['Epiphyte', 'A plant that grows on another plant for physical support but is not a parasite — many orchids are epiphytes'],
        ['Co-evolution', 'When two species evolve in response to each other — like an orchid shaping itself to attract a specific pollinator'],
      ],
      trueFalse: [
        { statement: 'Orchids are rare and only grow in tropical forests.', isTrue: false, explanation: 'Orchids are actually one of the largest flowering plant families on Earth, with over 28,000 known species. They grow on every continent except Antarctica — in deserts, mountains, grasslands, and yes, tropical forests. Northeast India alone hosts over 850 species.' },
        { statement: 'Some orchids can trick insects into pollinating them without offering any nectar.', isTrue: true, explanation: 'Certain orchid species have evolved to mimic the appearance and scent of female insects. Male insects attempt to mate with the flower and inadvertently pick up pollen. This is called pseudocopulation — the orchid gets pollinated while the insect gets nothing.' },
        { statement: 'Flower color is always caused by pigments.', isTrue: false, explanation: 'Some colors in nature come from nanostructures rather than pigments. Blue morpho butterflies and some orchids produce color through structural coloration — microscopic structures that interfere with light waves, much like how a soap bubble creates rainbows without any dye.' },
      ],
      facts: [
        'Vanilla — one of the most popular flavors in the world — comes from the seed pod of an orchid. The vanilla orchid must be hand-pollinated in most regions because its natural pollinator, a specific Mexican bee, does not exist elsewhere.',
        'Arunachal Pradesh is called the orchid paradise of India, with over 600 species. Some bloom only once every several years, and some have never been photographed in the wild — they remain known only from specimens collected decades ago.',
        'The smallest orchid in the world is Platystele jungermannioides — its flowers are just 2 millimetres wide, smaller than a pinhead. You could fit several dozen on a single fingernail.',
      ],
      offlineActivity: 'Find three different colored flowers (or colored leaves). Place each on a piece of white paper and crush it gently with a spoon to release the pigment. What colors transfer to the paper? Are they the same as the flower appeared? This demonstrates that the colors we see depend on which pigments the plant produces — and sometimes the color on paper differs from the living flower because structural effects are lost.',
    },"""

CUSTOM_LEVEL0['monkey-bridge'] = """    level0: {
      vocabulary: [
        ['Canopy', 'The uppermost layer of a forest formed by the crowns of tall trees — a separate ecosystem above the ground'],
        ['Brachiation', 'Swinging from branch to branch using the arms — the primary mode of travel for gibbons and some monkeys'],
        ['Biodiversity', 'The variety of different species in a given area — tropical forests have the highest biodiversity on Earth'],
        ['Prehensile tail', 'A tail that can grip and hold objects, functioning almost like a fifth limb — found in some monkey species'],
        ['Connectivity', 'In ecology, the degree to which habitats are linked, allowing animals to move between patches safely'],
      ],
      trueFalse: [
        { statement: 'Monkeys and apes are the same thing.', isTrue: false, explanation: 'Monkeys generally have tails and are smaller, while apes (gorillas, chimpanzees, orangutans, gibbons) have no tails and are generally larger with more complex brains. Humans are classified as great apes. India has many monkey species but only one ape — the hoolock gibbon of Northeast India.' },
        { statement: 'The forest canopy is like a separate world above the ground.', isTrue: true, explanation: 'The canopy layer — 20 to 40 metres above the forest floor — has its own unique temperature, humidity, light levels, and species. Many canopy animals never touch the ground in their entire lives. Scientists estimate that up to 50% of all terrestrial species live in forest canopies.' },
        { statement: 'When a road cuts through a forest, animals can easily cross it.', isTrue: false, explanation: 'Roads create barriers for many species, especially canopy-dwelling animals that travel through treetops. A road gap of just 20 metres can be impassable for a gibbon or a flying squirrel. This is why wildlife bridges and canopy crossings are crucial for maintaining animal movement and genetic diversity.' },
      ],
      facts: [
        'Namdapha National Park in Arunachal Pradesh is the only park in the world that is home to four big cat species — tiger, leopard, snow leopard, and clouded leopard — all in the same protected area.',
        'The hoolock gibbon, India\\'s only ape, can swing through trees at up to 55 km/h, covering 15 metres in a single swing. They are the fastest non-flying arboreal animals on Earth.',
        'In several countries, rope bridges strung across roads have successfully helped arboreal animals cross safely. In Australia, possum bridges reduced road kills by over 90% in monitored areas.',
      ],
      offlineActivity: 'Tie a string between two chairs about one metre apart — this represents a forest canopy. Now widen the gap to two metres and try to connect them with the same string without it sagging to the ground. This models the problem road gaps create for canopy animals. How would you design a bridge to reconnect the canopy? Sketch your design.',
    },"""

CUSTOM_LEVEL0['grandmother-remembered'] = """    level0: {
      vocabulary: [
        ['Neuron', 'A nerve cell that transmits information through electrical and chemical signals — the brain has roughly 86 billion of them'],
        ['Synapse', 'The tiny gap between two neurons where chemical signals pass from one to the next'],
        ['Hippocampus', 'A brain region shaped like a seahorse that is essential for forming new memories and spatial navigation'],
        ['Oral tradition', 'Knowledge passed from generation to generation through spoken stories, songs, and recitations rather than writing'],
        ['Encoding', 'The process of converting an experience into a memory — involves transforming sensory input into neural patterns'],
      ],
      trueFalse: [
        { statement: 'We use only 10% of our brain.', isTrue: false, explanation: 'This is one of the most persistent myths in science. Brain imaging shows that virtually all brain regions are active at various times. Even during sleep, much of the brain is working — consolidating memories, regulating body functions, and processing the day\\'s experiences.' },
        { statement: 'Telling a story helps you remember it better.', isTrue: true, explanation: 'When you narrate a memory, you activate multiple brain regions — language, emotion, visual imagery, and sequence planning. This strengthens the neural connections for that memory. It is called the "generation effect" — actively producing information creates stronger memory traces than passively receiving it.' },
        { statement: 'Memory works like a video recorder, capturing everything exactly as it happened.', isTrue: false, explanation: 'Memory is reconstructive, not reproductive. Every time you recall something, your brain reassembles it from stored fragments, and each reconstruction can introduce small changes. This is why eyewitness accounts often differ and why old memories gradually shift over time.' },
      ],
      facts: [
        'London taxi drivers who memorize the city\\'s 25,000 streets have measurably larger hippocampi than average. Their brains physically changed shape through years of spatial memory training — direct evidence that learning reshapes the brain.',
        'Before writing existed, entire civilizations preserved their laws, histories, and scientific knowledge through oral tradition. The Indian Vedas were transmitted orally for over 3,000 years with remarkable accuracy, using rhythmic chanting and strict repetition rules as error-correction mechanisms.',
        'Your brain forms about one million new neural connections every second during early childhood. By age two, a child\\'s brain has roughly twice as many synapses as an adult\\'s — the brain then prunes unused connections, keeping only the pathways that are regularly activated.',
      ],
      offlineActivity: 'Ask a grandparent or elder to tell you a story they remember from their childhood. Listen carefully without writing anything down. Wait one hour, then try to retell the story to someone else. How much did you remember? What parts did you forget or change? This demonstrates how oral tradition works — and why repetition and emotional connection are the keys to strong memory.',
    },"""

CUSTOM_LEVEL0['night-market-imphal'] = """    level0: {
      vocabulary: [
        ['Supply and demand', 'The economic principle that prices rise when demand exceeds supply and fall when supply exceeds demand'],
        ['Barter', 'Trading goods or services directly for other goods or services without using money'],
        ['Entrepreneur', 'A person who starts and runs a business, taking on financial risk in hope of profit'],
        ['Ima Keithel', 'The Mothers\\' Market in Imphal, Manipur — one of the largest all-women-run markets in the world, operating for over 500 years'],
        ['Market economy', 'An economic system where prices and production are determined by the interactions of buyers and sellers'],
      ],
      trueFalse: [
        { statement: 'The Ima Keithel market in Imphal is run entirely by women.', isTrue: true, explanation: 'Ima Keithel, meaning Mothers\\' Market, has been operated exclusively by women for over 500 years. Approximately 5,000 women vendors sell everything from vegetables and fish to textiles and household goods. It is one of the largest all-women markets in Asia and a powerful example of women\\'s economic independence.' },
        { statement: 'Prices in a market are fixed and never change.', isTrue: false, explanation: 'Prices in traditional markets fluctuate based on supply, demand, season, time of day, and competition. A vendor with the last basket of tomatoes at closing time might lower prices to avoid waste, while rare seasonal items command premiums. This is market economics in action.' },
        { statement: 'Money has always existed in human trade.', isTrue: false, explanation: 'For most of human history, trade was conducted through barter — directly exchanging goods for goods. Money in the form of coins only appeared around 600 BCE in Lydia (modern Turkey). Before that, people used shells, salt, cattle, and other commodities as units of exchange.' },
      ],
      facts: [
        'The Ima Keithel market in Imphal has survived wars, colonial rule, and natural disasters for over 500 years. It was burned down multiple times during British rule as punishment for women\\'s protests, and each time the women rebuilt it and returned.',
        'Night markets evolved because tropical heat makes daytime shopping uncomfortable. Evening markets take advantage of cooler temperatures, and the social atmosphere — food stalls, music, community gathering — turns commerce into culture.',
        'The concept of "haggling" or negotiating prices is not just cultural — it is an efficient economic mechanism. When buyers and sellers negotiate, they exchange information about the true value of goods, and the final price reflects a balance of both perspectives.',
      ],
      offlineActivity: 'Set up a mini market at home with family members. Give each person 5 items (snacks, stationery, toys) and 20 paper "coins." Take turns buying and selling, setting your own prices. Notice how prices change when an item is popular vs. when nobody wants it. You are experiencing supply and demand firsthand.',
    },"""

CUSTOM_LEVEL0['seed-keeper'] = """    level0: {
      vocabulary: [
        ['Genetic diversity', 'The variety of genes within a species — greater diversity means better ability to adapt to environmental changes'],
        ['Seed bank', 'A collection of seeds stored for conservation, ensuring that plant varieties survive even if they disappear from farms and forests'],
        ['Monoculture', 'Growing only one crop variety over a large area — efficient for production but vulnerable to disease and pests'],
        ['Heirloom variety', 'A traditional plant variety passed down through generations, often with unique flavors, colors, or disease resistance'],
        ['Germination', 'The process by which a seed sprouts and begins to grow into a new plant, triggered by water, temperature, and light'],
      ],
      trueFalse: [
        { statement: 'Modern farms grow more crop varieties than traditional farms did.', isTrue: false, explanation: 'The opposite is true. In the last century, we have lost roughly 75% of crop genetic diversity worldwide. Traditional farmers in Nagaland might grow 70 different rice varieties, while modern farms often grow just one or two high-yield varieties across vast areas.' },
        { statement: 'Seeds can remain alive for hundreds of years.', isTrue: true, explanation: 'A 2,000-year-old date palm seed found at Masada in Israel was successfully germinated in 2005. The Svalbard Global Seed Vault in Norway stores seeds at minus 18 degrees Celsius, where some can remain viable for centuries or even millennia.' },
        { statement: 'All rice tastes and looks the same.', isTrue: false, explanation: 'There are over 40,000 known varieties of rice worldwide, varying in color (white, red, black, purple), aroma, grain length, stickiness, and nutritional content. Northeast India alone grows hundreds of traditional varieties, each adapted to specific soil, water, and climate conditions.' },
      ],
      facts: [
        'The Svalbard Global Seed Vault in Norway, buried inside an Arctic mountain, holds over 1.1 million seed samples from around the world — a backup copy of Earth\\'s agricultural diversity in case of global catastrophe.',
        'Nagaland\\'s traditional farmers are living seed banks. Some communities maintain over 70 varieties of rice, each with different cooking properties, nutritional profiles, and resistance to specific pests or weather conditions. This knowledge has been passed down for thousands of years.',
        'The Irish Potato Famine of 1845-1852 killed one million people partly because nearly all Irish potatoes were a single variety (the Lumper), making the entire crop vulnerable to one disease. Genetic diversity could have prevented the catastrophe.',
      ],
      offlineActivity: 'Collect seeds from five different fruits or vegetables in your kitchen — for example, tomato, lemon, chili, pumpkin, and coriander. Compare their size, shape, color, and texture. Plant three seeds from each in small cups of soil and observe which sprout first and grow fastest. You are conducting a germination experiment comparing genetic diversity.',
    },"""

CUSTOM_LEVEL0['cloud-namer'] = """    level0: {
      vocabulary: [
        ['Taxonomy', 'The science of classifying and naming organisms or objects into ordered groups based on shared characteristics'],
        ['Cumulus', 'Puffy, white, flat-bottomed clouds that form during fair weather — they look like cotton balls floating in the sky'],
        ['Stratus', 'Flat, grey, sheet-like clouds that cover the sky like a blanket — they often bring drizzle or light rain'],
        ['Cumulonimbus', 'Towering storm clouds that can reach over 12,000 metres — they produce thunder, lightning, heavy rain, and sometimes hail'],
        ['Classification', 'The process of organizing things into groups based on shared features — a fundamental tool in all sciences'],
      ],
      trueFalse: [
        { statement: 'Clouds are made of water vapor.', isTrue: false, explanation: 'This is a common misconception. Water vapor is invisible gas — you cannot see it. Clouds are made of tiny liquid water droplets or ice crystals that have condensed from water vapor. The white puffy shape you see is millions of microscopic droplets scattering sunlight.' },
        { statement: 'You can predict weather by looking at cloud shapes.', isTrue: true, explanation: 'Different cloud types indicate different atmospheric conditions. Tall cumulonimbus clouds warn of thunderstorms. Thin, wispy cirrus clouds often mean fair weather but approaching change. Farmers and sailors used cloud reading for centuries before modern meteorology existed.' },
        { statement: 'The same cloud classification system is used worldwide.', isTrue: true, explanation: 'Luke Howard, an English chemist, created the cloud classification system in 1802 using Latin names. His system (cumulus, stratus, cirrus, nimbus, and their combinations) is still used globally by meteorologists in every country — a rare example of a scientific naming system that has survived over 200 years unchanged.' },
      ],
      facts: [
        'A typical cumulus cloud weighs about 500,000 kilograms — roughly the weight of 80 elephants. It floats because the water droplets are spread across a huge volume and the warm air rising beneath it provides continuous lift.',
        'Carl Linnaeus created the modern biological classification system in the 1700s, organizing all living things into kingdom, phylum, class, order, family, genus, and species. The same drive to classify that names clouds also names every species on Earth.',
        'Humans are natural classifiers — even toddlers sort objects by color and shape. This instinct is the foundation of all science. Taxonomy is simply the formal, systematic version of something our brains do automatically.',
      ],
      offlineActivity: 'Spend three days looking at the sky at the same time each day. Draw the clouds you see and invent your own names for each type based on their shape. Then look up the official names — cumulus, stratus, cirrus — and compare with your system. You have just done what Luke Howard did in 1802: created a taxonomy from observation.',
    },"""

CUSTOM_LEVEL0['kingfisher-blue'] = """    level0: {
      vocabulary: [
        ['Structural coloration', 'Color produced by microscopic structures that interfere with light, rather than by pigment — responsible for the iridescent blue of kingfishers and morpho butterflies'],
        ['Wavelength', 'The distance between two peaks of a wave — in light, wavelength determines color. Blue light has a short wavelength, red light has a long one'],
        ['Refraction', 'The bending of light as it passes from one material to another — this is what makes a straw look bent in a glass of water'],
        ['Nanostructure', 'A structure measured in nanometres (billionths of a metre) — small enough to interact with light waves and alter color'],
        ['Iridescence', 'A color effect that changes depending on the angle of view — caused by light interacting with layered or periodic nanostructures'],
      ],
      trueFalse: [
        { statement: 'Kingfisher feathers contain blue pigment.', isTrue: false, explanation: 'Kingfisher feathers have no blue pigment at all. If you crush a kingfisher feather, it turns brown — the actual pigment is melanin. The brilliant blue comes from nanostructures in the feather that scatter light, selectively reflecting blue wavelengths. Destroy the structure, and the color vanishes.' },
        { statement: 'A rainbow is made of seven distinct colors.', isTrue: false, explanation: 'A rainbow is actually a continuous spectrum — the colors blend smoothly into each other with no sharp boundaries. Isaac Newton chose seven colors (red, orange, yellow, green, blue, indigo, violet) partly because he liked the number seven, believing it had mystical significance. In reality, there are infinite gradations.' },
        { statement: 'Some animals can see colors that humans cannot.', isTrue: true, explanation: 'Many birds, including kingfishers, can see ultraviolet light — an entire dimension of color invisible to humans. Mantis shrimp have 16 types of color receptors (humans have 3). The world looks radically different depending on which eyes are viewing it.' },
      ],
      facts: [
        'Japan\\'s famous Shinkansen bullet train was redesigned based on the kingfisher\\'s beak. The original train created a loud boom when exiting tunnels. Engineers noticed kingfishers dive from air into water almost silently, and reshaped the train\\'s nose accordingly — reducing noise by 30% and energy use by 15%.',
        'The blue morpho butterfly and the kingfisher both produce blue through nanostructures, not pigment. Scientists are copying these structures to create paints and fabrics that never fade — because structural color does not degrade the way chemical pigments do.',
        'The sky is blue for the same fundamental reason kingfishers are blue: shorter wavelengths of light (blue) scatter more than longer ones (red). This is called Rayleigh scattering, and it connects a feather, the atmosphere, and the physics of light into one elegant explanation.',
      ],
      offlineActivity: 'Hold a CD or DVD under a bright light and tilt it slowly. Watch the rainbow of colors shift as you change the angle. This is structural coloration — the tiny grooves on the disc are diffracting light, separating wavelengths. No pigment is involved. The same principle creates the kingfisher\\'s blue, the iridescence of soap bubbles, and the shimmer of oil on water.',
    },"""

CUSTOM_LEVEL0['music-dimasa'] = """    level0: {
      vocabulary: [
        ['Frequency', 'The number of vibrations per second, measured in Hertz (Hz) — higher frequency means higher pitch'],
        ['Resonance', 'When an object vibrates at its natural frequency in response to an external vibration, amplifying the sound'],
        ['Amplitude', 'The height of a sound wave — greater amplitude means louder sound'],
        ['Harmonics', 'Higher-frequency vibrations that accompany a fundamental tone, giving each instrument its unique quality or timbre'],
        ['Rhythm', 'A pattern of beats repeated at regular intervals — the mathematical backbone of music'],
      ],
      trueFalse: [
        { statement: 'Sound can travel through empty space.', isTrue: false, explanation: 'Sound requires a medium — air, water, or solid material — to travel through. In the vacuum of space, there is no air for sound waves to vibrate, which is why space is completely silent. Explosions in space movies would actually be soundless.' },
        { statement: 'Music and mathematics are deeply connected.', isTrue: true, explanation: 'Musical scales are based on mathematical ratios discovered by Pythagoras over 2,500 years ago. An octave is exactly a 2:1 frequency ratio. A perfect fifth is 3:2. Rhythm is division of time into equal parts. Every piece of music is, at its core, a mathematical structure.' },
        { statement: 'Drums produce only one note.', isTrue: false, explanation: 'A drum produces a complex mixture of frequencies. The fundamental tone depends on the drum\\'s size, skin tension, and striking point. Skilled players like Dimasa drummers can produce multiple distinct pitches from a single drum by varying where and how hard they strike.' },
      ],
      facts: [
        'The Dimasa people of Assam have one of the oldest musical traditions in Northeast India. Their instruments — the khram (drum), muri (flute), and jotha (cymbal) — produce sounds based on the same physics that governs all music worldwide: vibrating membranes, air columns, and metal plates.',
        'Every musical instrument in the world works on one of four principles: vibrating strings (guitar, sitar), vibrating air columns (flute, trumpet), vibrating membranes (drums), or vibrating solid bodies (xylophone, bells). All music reduces to physics.',
        'The human ear can detect sounds ranging from 20 Hz (a deep rumble) to 20,000 Hz (a high whine). Dogs can hear up to 65,000 Hz, and bats up to 110,000 Hz. The lowest note on a piano is 27.5 Hz, and the highest is 4,186 Hz — a tiny fraction of what other species can perceive.',
      ],
      offlineActivity: 'Fill four identical glasses with different amounts of water. Tap each with a spoon and listen to the pitch. The glass with the least water produces the highest pitch because the glass wall vibrates more freely. Arrange them from low to high pitch — you have built a simple musical instrument. Try playing a simple melody. This demonstrates how frequency changes with the vibrating body\\'s properties.',
    },"""

CUSTOM_LEVEL0['frogs-sing-rain'] = """    level0: {
      vocabulary: [
        ['Bioacoustics', 'The study of sound production, transmission, and reception in animals — how and why organisms make noise'],
        ['Amphibian', 'A cold-blooded vertebrate that typically lives in water as a larva and on land as an adult — frogs, toads, and salamanders'],
        ['Atmospheric pressure', 'The weight of the air above a given point — it drops before rain, which many animals can detect'],
        ['Vocal sac', 'An inflatable throat pouch in male frogs that amplifies their calls, sometimes making them audible over a kilometre away'],
        ['Metamorphosis', 'A dramatic change in body form during development — tadpoles transforming into frogs is a classic example'],
      ],
      trueFalse: [
        { statement: 'Frogs sing because they enjoy the rain.', isTrue: false, explanation: 'Frogs call after rain primarily to attract mates. Rain creates temporary pools ideal for laying eggs, and the high humidity keeps their skin moist (frogs breathe partly through their skin). The chorus is a mating advertisement, not a celebration — though it sounds like one.' },
        { statement: 'Some frogs can survive being frozen solid.', isTrue: true, explanation: 'The wood frog of North America can survive with 65% of its body water frozen. It produces glucose as an antifreeze that protects its cells from ice crystal damage. Its heart stops, its brain stops, and it looks dead — but when it thaws in spring, it hops away perfectly healthy.' },
        { statement: 'Frogs drink water through their mouths.', isTrue: false, explanation: 'Frogs absorb nearly all their water through their skin, particularly through a patch on their belly called the "drinking patch." They rarely if ever drink through their mouths. This is why frogs are so sensitive to water pollution — toxins pass directly through their skin into their bloodstream.' },
      ],
      facts: [
        'A single male coqui frog in Puerto Rico can produce calls reaching 100 decibels — as loud as a motorcycle. Its entire body is only 2.5 centimetres long. Proportional to body size, some frogs are among the loudest animals on Earth.',
        'Northeast India is a frog biodiversity hotspot. Scientists discovered 30 new frog species in the region in a single decade, including frogs that live entirely in tree hollows and a species that gives birth to tadpoles rather than laying eggs.',
        'Frogs are biological indicators of environmental health. Because they absorb water and chemicals through their skin and live in both water and on land, declining frog populations often signal pollution, habitat destruction, or climate change before other species are affected.',
      ],
      offlineActivity: 'After the next rainfall, go outside and listen carefully. Can you hear frogs calling? Count how many different call types you hear — each distinct sound likely represents a different species. Note the pitch (high or low) and pattern (continuous trill, repeated chirps, single notes). You are conducting a bioacoustic survey, the same method scientists use to monitor frog populations without seeing a single frog.',
    },"""

CUSTOM_LEVEL0['dhol-drum'] = """    level0: {
      vocabulary: [
        ['Vibration', 'A rapid back-and-forth movement that creates sound waves — every sound you hear is caused by something vibrating'],
        ['Membrane', 'A thin, flexible sheet stretched over a frame — in drums, the vibrating membrane produces the sound'],
        ['Pitch', 'How high or low a sound is, determined by its frequency — tighter drum skins produce higher pitches'],
        ['Decibel', 'The unit used to measure sound intensity — normal conversation is about 60 dB, while a dhol can exceed 110 dB'],
        ['Tension', 'The force stretching something tight — in drums, higher tension on the skin means higher frequency and higher pitch'],
      ],
      trueFalse: [
        { statement: 'Bigger drums always produce lower sounds.', isTrue: true, explanation: 'Larger drum membranes vibrate more slowly, producing lower frequencies (deeper sounds). This is why a bass drum is large and deep-sounding while a snare drum is smaller and higher-pitched. The same principle applies to guitar strings — thicker, longer strings produce lower notes.' },
        { statement: 'Sound travels faster through air than through water.', isTrue: false, explanation: 'Sound travels about 4.3 times faster through water than through air (1,480 m/s vs 343 m/s) and even faster through solids like steel (5,960 m/s). Sound needs molecules to vibrate, and the closer together the molecules are, the faster the vibration passes along.' },
        { statement: 'The dhol is played only in Assam.', isTrue: false, explanation: 'Variations of the double-headed drum exist across South Asia, the Middle East, and Africa. In Assam, the dhol is central to Bihu celebrations. In Punjab, it drives bhangra. Similar drums appear in Turkish, Persian, and West African traditions — evidence of how percussion physics is universal.' },
      ],
      facts: [
        'The Assamese dhol is a double-headed cylindrical drum traditionally made from jackfruit or mango wood with goat or cow skin heads. The two heads are tuned to different pitches — one low (bass) and one high (treble) — allowing a single drummer to produce complex rhythmic patterns.',
        'Sustained exposure to sounds above 85 decibels can cause permanent hearing damage. A dhol at close range can produce over 110 decibels. Traditional dhol players who perform for decades often develop hearing loss — the same occupational hazard faced by rock musicians and construction workers.',
        'Drums are among the oldest human instruments — prehistoric drums made from hollowed logs and animal skins have been found dating back over 6,000 years. The basic physics has not changed: stretch a membrane, strike it, and the vibration creates sound waves.',
      ],
      offlineActivity: 'Stretch cling wrap tightly over the opening of a bowl and secure it with a rubber band. Place a few grains of rice on top. Now hold a metal pot near the bowl and bang it with a spoon. Watch the rice grains jump — they are being moved by sound waves hitting the cling wrap membrane. This is exactly how a drum works, and how your eardrum receives sound.',
    },"""

CUSTOM_LEVEL0['flying-squirrel'] = """    level0: {
      vocabulary: [
        ['Gliding', 'Moving through the air without powered flight by using a membrane or body shape to generate lift — different from true flight'],
        ['Patagium', 'The membrane of skin stretching between the fore and hind limbs of a flying squirrel, used as a gliding surface'],
        ['Aerodynamics', 'The study of how air moves around objects — understanding lift, drag, and thrust'],
        ['Lift', 'The upward force generated when air moves faster over the top of a surface than underneath it'],
        ['Nocturnal', 'Active primarily at night — flying squirrels have enormous eyes adapted for seeing in near-total darkness'],
      ],
      trueFalse: [
        { statement: 'Flying squirrels actually fly like birds.', isTrue: false, explanation: 'Flying squirrels do not fly — they glide. They launch from a high point, spread their patagium (skin membrane), and control their descent angle and direction using their tail as a rudder. They cannot gain altitude during a glide. True flight requires powered wing flapping, which only birds, bats, and insects can do.' },
        { statement: 'Hollongapar Gibbon Sanctuary is the only home of giant flying squirrels in India.', isTrue: false, explanation: 'Giant flying squirrels live across Southeast Asian forests, but Hollongapar in Assam is one of the most accessible places to observe them. The sanctuary is also famous as home to India\\'s only ape — the western hoolock gibbon.' },
        { statement: 'Gliding evolved independently in many different animal groups.', isTrue: true, explanation: 'Gliding has evolved separately in squirrels, lizards (Draco), frogs (Wallace\\'s flying frog), snakes (paradise tree snake), and even fish. This is called convergent evolution — when different species independently develop similar solutions to the same problem (moving between trees without touching the ground).' },
      ],
      facts: [
        'The giant Indian flying squirrel can glide over 100 metres in a single launch — the length of a football field. By adjusting the angle of its limbs and tail, it can make sharp turns, change direction mid-glide, and land with precision on a target branch.',
        'Hollongapar Gibbon Sanctuary near Jorhat, Assam, is only 20 square kilometres but contains one of the richest concentrations of primates and gliding mammals in India, including hoolock gibbons, slow lorises, and multiple species of flying squirrels.',
        'Engineers study flying squirrel gliding to design better wingsuits for humans and more efficient drone designs. The squirrel\\'s patagium provides an optimal balance of lift and maneuverability that current human technology struggles to replicate at small scales.',
      ],
      offlineActivity: 'Make two paper airplanes — one with wide wings and one with narrow wings. Throw each from the same height and measure how far they glide. The wide-winged plane should glide farther and more slowly, similar to how a flying squirrel\\'s spread membrane creates maximum lift. Now add small paper flaps (ailerons) and see if you can steer the plane by bending them — this is how the squirrel uses its tail.',
    },"""

CUSTOM_LEVEL0['takin-face'] = """    level0: {
      vocabulary: [
        ['Morphology', 'The study of the form and structure of organisms — why animals are shaped the way they are'],
        ['Natural selection', 'The process by which organisms with traits better suited to their environment tend to survive and reproduce more'],
        ['Genotype', 'The genetic makeup of an organism — the DNA instructions that determine potential physical traits'],
        ['Phenotype', 'The observable physical characteristics of an organism — what it actually looks like, which is influenced by both genes and environment'],
        ['Convergent evolution', 'When unrelated species develop similar traits independently because they face similar environmental pressures'],
      ],
      trueFalse: [
        { statement: 'The takin is closely related to the cow.', isTrue: false, explanation: 'Despite looking somewhat cow-like, the takin is actually more closely related to sheep and goats. It belongs to the subfamily Caprinae (goat-antelopes). Its stocky, cow-like body is an adaptation to cold mountain environments, not evidence of close relation to cattle — this is convergent evolution in action.' },
        { statement: 'An animal\\'s appearance is determined entirely by its genes.', isTrue: false, explanation: 'Appearance (phenotype) is shaped by both genetics and environment. A takin living at higher altitude may develop thicker fur than one at lower altitude, despite identical genes. Nutrition, temperature, and sunlight all influence how genetic instructions are expressed — nature and nurture work together.' },
        { statement: 'Every physical feature of an animal has a survival purpose.', isTrue: false, explanation: 'While natural selection shapes many features, some traits are neutral byproducts, historical remnants, or the result of genetic drift. The takin\\'s distinctive face shape may partly be functional (warming cold air before it reaches the lungs) and partly just the accumulated result of random genetic variation in a small population.' },
      ],
      facts: [
        'The takin is the national animal of Bhutan and is found in the forests of Arunachal Pradesh in India. It can weigh up to 350 kilograms and has a unique oily, golden coat that acts as a natural raincoat — the oil repels water and insulates against the cold mountain rain.',
        'Legend says the takin was created by a Tibetan saint who stuck a goat\\'s head on a cow\\'s body. While obviously myth, it captures the real puzzle of takin morphology — an animal that genuinely looks like a mashup of several different species, which confused zoologists for decades.',
        'The takin\\'s large, moose-like nose is thought to warm cold mountain air before it reaches the lungs, similar to how the saiga antelope\\'s bizarre nose filters dust on Central Asian steppes. Large nasal passages are a repeated solution to harsh atmospheric conditions across different mountain species.',
      ],
      offlineActivity: 'Look at photos of five different animals that live in cold mountains — takin, yak, mountain goat, musk ox, and snow leopard. List the features they share (thick fur, stocky body, large hooves). Now list features that differ. The shared features are likely adaptations to cold mountain life (convergent evolution), while differences reflect their unique evolutionary histories. You are doing comparative morphology.',
    },"""

CUSTOM_LEVEL0['secret-garden-loktak'] = """    level0: {
      vocabulary: [
        ['Phumdi', 'Floating mats of vegetation, soil, and organic matter found on Loktak Lake — thick enough to support houses and gardens'],
        ['Wetland', 'An area of land saturated with water, either permanently or seasonally — among the most productive ecosystems on Earth'],
        ['Aquatic plant', 'A plant that grows in or on water — adapted with special tissues that transport oxygen to submerged roots'],
        ['Decomposition', 'The breakdown of dead organic matter by bacteria and fungi — releasing nutrients back into the ecosystem'],
        ['Ecosystem services', 'The benefits humans receive from ecosystems — clean water, flood control, food, and climate regulation'],
      ],
      trueFalse: [
        { statement: 'Loktak Lake has islands that actually float and drift with the wind.', isTrue: true, explanation: 'Loktak Lake in Manipur is home to the largest floating islands in the world. The phumdi (floating mats) are made of accumulated vegetation and organic debris, some over 1.5 metres thick. People live, farm, and fish on these floating platforms, and some islands shift position daily.' },
        { statement: 'Wetlands are wastelands with no ecological value.', isTrue: false, explanation: 'Wetlands are among the most valuable ecosystems on Earth. They filter pollutants from water, absorb floods, store carbon, and support extraordinary biodiversity. A single hectare of wetland can provide ecosystem services worth thousands of dollars per year — far more than most farmland.' },
        { statement: 'Plants can only grow in soil.', isTrue: false, explanation: 'Many plants grow without soil — in water (aquatic plants), on other plants (epiphytes like orchids), or on rocks (lithophytes like mosses). Hydroponics, the practice of growing plants in nutrient-rich water without soil, produces food commercially worldwide.' },
      ],
      facts: [
        'Keibul Lamjao National Park, located on Loktak Lake, is the only floating national park in the world. It is the last natural habitat of the endangered Sangai deer (Manipur brow-antlered deer), which walks on the floating phumdi with specially adapted wide hooves.',
        'Loktak Lake is the largest freshwater lake in Northeast India, covering about 287 square kilometres. The floating phumdi cover up to 40% of the lake surface and have been forming for thousands of years through accumulated plant matter.',
        'Wetlands cover only about 6% of Earth\\'s land surface but store roughly 35% of all terrestrial carbon — making them critical for climate regulation. Draining wetlands releases this stored carbon as greenhouse gases, accelerating climate change.',
      ],
      offlineActivity: 'Fill a large bowl with water. Place different materials on the surface — a leaf, a piece of sponge, a twig, a ball of cotton. Which ones float? Now gently push down on each floating object — which ones support the most weight before sinking? This demonstrates the principle behind phumdi formation: tangled organic matter creates a platform with surprising buoyancy and load-bearing capacity.',
    },"""

CUSTOM_LEVEL0['elephant-corridor'] = """    level0: {
      vocabulary: [
        ['Wildlife corridor', 'A strip of habitat connecting two larger habitat areas, allowing animals to move between them safely'],
        ['Habitat fragmentation', 'The breaking of large continuous habitats into smaller, isolated patches — a major threat to wildlife'],
        ['Migration', 'Regular, seasonal movement of animals between different areas, often following food or water sources'],
        ['Matriarch', 'The oldest and most experienced female elephant who leads the herd — she carries decades of knowledge about routes, water sources, and dangers'],
        ['Human-wildlife conflict', 'Negative interactions between people and wild animals, often caused by overlapping land use'],
      ],
      trueFalse: [
        { statement: 'Elephants follow the same paths for generations.', isTrue: true, explanation: 'Elephant migration routes are passed down from matriarch to matriarch over hundreds of years. The paths are encoded in the herd\\'s collective memory. When these ancient routes are blocked by roads, farms, or buildings, elephants often try to walk through the obstacles anyway — they are following a map older than human settlement.' },
        { statement: 'Building a fence is the best way to keep elephants out of villages.', isTrue: false, explanation: 'Adult elephants can easily break through most fences. Solar-powered electric fences provide temporary deterrence but determined elephants learn to push trees onto the wires. The most effective long-term solution is wildlife corridors that give elephants a clear, unobstructed path through human-settled areas.' },
        { statement: 'India has more wild Asian elephants than any other country.', isTrue: true, explanation: 'India is home to approximately 27,000 wild Asian elephants — over 60% of the global population. Assam alone has about 5,700, making it one of the most important elephant landscapes in Asia. However, habitat loss and fragmentation threaten these populations every year.' },
      ],
      facts: [
        'Assam has identified over 40 elephant corridors — narrow strips of forest connecting larger habitats. Many pass through tea gardens and villages. When corridors are blocked, elephants are forced into human areas, leading to crop damage, property destruction, and sometimes human or elephant deaths.',
        'An elephant herd\\'s matriarch may be 60 or more years old. Research shows that herds led by older matriarchs make better decisions about routes and threats — the matriarch\\'s memory of past droughts, dangers, and food sources directly improves the herd\\'s survival.',
        'Wildlife corridors benefit far more than just elephants. A corridor created for elephant movement also serves deer, leopards, small mammals, birds, reptiles, and insects. The strip of protected habitat becomes a lifeline for the entire ecosystem.',
      ],
      offlineActivity: 'Draw a map of your neighborhood. Mark where animals (birds, squirrels, insects, dogs) move and where barriers exist (walls, roads, buildings). Can you identify natural corridors animals use? Where are the gaps? Propose one change that would help animals move more safely. You are thinking like a wildlife corridor planner.',
    },"""

CUSTOM_LEVEL0['friendship-bridge'] = """    level0: {
      vocabulary: [
        ['Compression', 'A pushing force that squeezes material together — the top of a loaded beam is under compression'],
        ['Tension', 'A pulling force that stretches material apart — the bottom of a loaded beam and the cables of a suspension bridge are under tension'],
        ['Load', 'The total weight and forces that a structure must support — including its own weight (dead load) and the weight of people, vehicles, and wind (live load)'],
        ['Span', 'The distance a bridge covers between its supports — longer spans require more sophisticated engineering'],
        ['Truss', 'A framework of triangles used in bridge construction — triangles are the strongest geometric shape because they cannot deform without changing side lengths'],
      ],
      trueFalse: [
        { statement: 'Triangles are used in bridges because they look decorative.', isTrue: false, explanation: 'Triangles are the only geometric shape that cannot be deformed without changing the length of a side. A square can be pushed into a parallelogram, but a triangle holds firm. This rigidity makes triangles the fundamental building block of strong, lightweight structures — from bridges to roof trusses to crane arms.' },
        { statement: 'Living root bridges in Meghalaya are made without any tools or building materials.', isTrue: true, explanation: 'The Khasi people of Meghalaya train the aerial roots of rubber fig trees across rivers and streams. Over 15 to 30 years, the roots grow together, forming bridges that can support the weight of 50 people. Some are over 500 years old and still in use — they are bridges that grow stronger with age.' },
        { statement: 'Suspension bridges are the oldest type of bridge.', isTrue: false, explanation: 'Beam bridges (a log across a stream) and arch bridges are far older. Suspension bridges, which hang the roadway from cables, were developed in their modern form in the early 1800s. Ancient versions using rope existed in South America and the Himalayas, but the engineering principles were formalized much later.' },
      ],
      facts: [
        'The living root bridges of Cherrapunji, Meghalaya, are recognized by UNESCO and are found nowhere else on Earth. Some double-decker root bridges have two levels of walkable roots stacked vertically — a feat of biological engineering that took two human generations to complete.',
        'The Romans built stone arch bridges over 2,000 years ago that still stand today. The Pont du Gard in France carries its own weight of 50,000 tonnes using only precisely cut stones — no mortar or cement. The arch distributes forces so efficiently that the stones hold each other in place through compression alone.',
        'When a bridge vibrates at its natural resonance frequency, it can oscillate wildly. The Tacoma Narrows Bridge in Washington state collapsed in 1940 after wind caused it to twist at its resonant frequency — the event was captured on film and changed bridge engineering forever.',
      ],
      offlineActivity: 'Build two bridges from paper. For the first, fold a sheet of paper in half lengthwise and place it between two books. For the second, fold the paper into an accordion (zigzag) pattern. Place coins on each bridge until it collapses. The accordion bridge holds far more weight because the folds act like mini trusses, resisting bending. You have just demonstrated why shape matters more than material in structural engineering.',
    },"""

CUSTOM_LEVEL0['dancer-floating-market'] = """    level0: {
      vocabulary: [
        ['Supply chain', 'The entire sequence of steps from producing a good to delivering it to the consumer — farm to table, factory to shop'],
        ['Barter economy', 'A system where goods and services are exchanged directly without money — common in traditional markets worldwide'],
        ['Marginal cost', 'The cost of producing one additional unit of a good — understanding this helps sellers decide how much to produce'],
        ['Infrastructure', 'The basic physical systems a community needs — roads, water, electricity, markets — that enable economic activity'],
        ['Cultural economy', 'Economic activity driven by cultural traditions, arts, and heritage — tourism, crafts, and festivals are examples'],
      ],
      trueFalse: [
        { statement: 'Floating markets exist only in Southeast Asia.', isTrue: false, explanation: 'While Thailand and Vietnam are famous for floating markets, they exist on every continent. The Cai Rang market in Vietnam, the Damnoen Saduak in Thailand, the floating markets of Dal Lake in Kashmir, and the river markets of Amazonia all share the same logic: when water is the primary transport route, commerce moves to the water.' },
        { statement: 'Markets are only about buying and selling.', isTrue: false, explanation: 'Markets are social institutions that serve multiple functions — information exchange, community bonding, cultural expression, and conflict resolution. A market is where people learn crop prices, share news, arrange marriages, settle disputes, and build trust. The economic function is just one layer.' },
        { statement: 'Art and dance have no economic value.', isTrue: false, explanation: 'The creative economy contributes trillions of dollars globally. Dancers at floating markets draw tourists, increasing sales for all vendors. Traditional crafts, performances, and cultural heritage drive tourism that supports entire communities. Art is both culture and commerce.' },
      ],
      facts: [
        'The women of Loktak Lake in Manipur and the klongs of Thailand run some of the oldest floating markets in Asia. Goods are sold directly from boats — a distribution system that requires no roads, no trucks, and no warehouses. The water is the infrastructure.',
        'In many traditional markets across Northeast India, prices are set through personal relationships rather than posted signs. A vendor might charge less to a regular customer or more during festivals — this dynamic pricing is exactly what modern "surge pricing" algorithms try to replicate.',
        'The "multiplier effect" in economics means that money spent at a local market circulates through the community multiple times. A customer pays a vegetable seller, who pays a boat builder, who pays a rice farmer — one transaction generates several rounds of economic activity.',
      ],
      offlineActivity: 'Track where the food on your dinner plate came from. For each item, try to identify: Who grew it? How far did it travel? How many people handled it between farm and your plate? Draw the supply chain for one item. Compare this to a floating market where the farmer paddles directly to the customer — how many steps are eliminated? This reveals why floating markets are among the most efficient food distribution systems ever invented.',
    },"""

CUSTOM_LEVEL0['story-garden'] = """    level0: {
      vocabulary: [
        ['Narrative', 'A connected sequence of events told as a story — every narrative has characters, conflict, and resolution'],
        ['Metaphor', 'Describing one thing as if it were another to create understanding — "the classroom was a zoo" helps you picture chaos without literal animals'],
        ['Oral tradition', 'Stories, knowledge, and culture passed down through spoken word rather than writing — the oldest form of information transfer'],
        ['Plot structure', 'The organized pattern of events in a story — typically involving setup, rising action, climax, and resolution'],
        ['Cognitive load', 'The amount of mental effort being used in working memory — stories reduce cognitive load by packaging information in memorable patterns'],
      ],
      trueFalse: [
        { statement: 'Stories are just for entertainment.', isTrue: false, explanation: 'Stories are powerful learning tools. Research shows that information embedded in a narrative is 22 times more memorable than facts alone. Medical students taught through case stories retain diagnostic information better than those given textbook lists. Stories are technology — the oldest and most effective information technology humans ever invented.' },
        { statement: 'Every culture on Earth has a tradition of storytelling.', isTrue: true, explanation: 'No human culture has ever been discovered that lacks stories. From Aboriginal Australian dreamtime narratives (over 50,000 years old) to modern novels and films, storytelling appears to be a fundamental human cognitive ability — as universal as language itself.' },
        { statement: 'Written stories are more accurate than oral stories.', isTrue: false, explanation: 'Oral traditions can be remarkably accurate. Aboriginal Australian stories describe coastal geography from over 7,000 years ago, before sea levels rose — and match geological evidence perfectly. The Vedas were transmitted orally for 3,000 years with extraordinary precision. Rhythm, repetition, and social reinforcement make oral tradition a robust storage medium.' },
      ],
      facts: [
        'The human brain processes stories differently from raw information. When you hear a story, your brain activates the same regions that would be active if you were experiencing the events yourself — motor cortex for action, sensory cortex for descriptions. Stories are virtual reality for the brain.',
        'The oldest known written story is the Epic of Gilgamesh from Mesopotamia, dating to about 2100 BCE. But oral stories predate writing by tens of thousands of years. Cave paintings at Lascaux, France (17,000 years old) appear to depict narrative sequences — stories told in images before writing existed.',
        'Scientists studying information retention found that people remember 65-70% of information shared through stories after three days, compared to only 5-10% of information shared as statistics or bullet points. This is called the "story advantage" in cognitive science.',
      ],
      offlineActivity: 'Tell a simple story to three different people (a sibling, a parent, a friend). After one day, ask each person to retell the story back to you. What did they remember? What did they change? What did they add? This demonstrates how stories evolve through retelling — and why oral traditions develop specific techniques (rhythm, repetition, vivid imagery) to minimize changes.',
    },"""

def main():
    with open(LESSONS_FILE, 'r') as f:
        content = f.read()

    # For each story that needs custom level0, find its slug position and replace the generic block
    replaced = 0
    skipped = []

    for slug, custom_block in CUSTOM_LEVEL0.items():
        # Find the slug's position
        slug_marker = f"slug: '{slug}'"
        slug_pos = content.find(slug_marker)
        if slug_pos == -1:
            skipped.append(f"{slug}: slug not found")
            continue

        # Find the next slug to bound the search
        next_slug_pos = content.find("slug: '", slug_pos + len(slug_marker))
        if next_slug_pos == -1:
            story_block = content[slug_pos:]
        else:
            story_block = content[slug_pos:next_slug_pos]

        # Check for generic level0 (short version)
        if GENERIC_LEVEL0 in story_block:
            old_block = GENERIC_LEVEL0
        elif GENERIC_LEVEL0_ALT in story_block:
            old_block = GENERIC_LEVEL0_ALT
        else:
            skipped.append(f"{slug}: generic level0 pattern not found")
            continue

        # Replace within the story block
        abs_pos = content.find(old_block, slug_pos)
        if abs_pos == -1 or (next_slug_pos != -1 and abs_pos > next_slug_pos):
            skipped.append(f"{slug}: could not locate generic block within story bounds")
            continue

        content = content[:abs_pos] + custom_block + content[abs_pos + len(old_block):]
        replaced += 1
        print(f"Replaced: {slug}")

    with open(LESSONS_FILE, 'w') as f:
        f.write(content)

    print(f"\nDone. Replaced {replaced}/{len(CUSTOM_LEVEL0)} stories.")
    if skipped:
        print(f"Skipped {len(skipped)}:")
        for s in skipped:
            print(f"  {s}")


if __name__ == '__main__':
    main()
