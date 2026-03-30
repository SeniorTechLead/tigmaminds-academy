#!/usr/bin/env python3
"""
Fill empty STEM sections (skills, realWorld, project) for 90 stories in lessons.ts.

Each story has a stem section with:
  skills: []          -> array of 3-5 skill strings
  realWorld: []       -> array of 3-4 real-world application strings
  project: { title: '', description: '', steps: [] }  -> project with 4-5 steps

This script generates unique, accurate content based on each story's slug,
stem title, and STEM topic, then writes it back into lessons.ts.
"""

import re
import sys
import os

LESSONS_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'lessons.ts')

# ── Content for all 90 stories, keyed by slug ──────────────────────────────

STEM_CONTENT = {
    'orange-sunsets-assam': {
        'skills': [
            'Understand Rayleigh scattering and wavelength-dependent light behavior',
            'Model photon paths through atmospheric layers',
            'Analyze spectral data from sunlight at different times of day',
            'Calculate scattering cross-sections for different wavelengths',
        ],
        'realWorld': [
            'Atmospheric scientists use scattering models to predict air quality from satellite imagery',
            'Smartphone cameras apply white-balance algorithms that account for Rayleigh scattering',
            'Pilots and sailors read sky color to estimate weather conditions without instruments',
        ],
        'project': {
            'title': 'Build a Sunset Color Simulator',
            'description': 'Create a Python program that simulates how sunlight scatters through the atmosphere at different sun angles, producing the color gradient of a sunset.',
            'steps': [
                'Research the Rayleigh scattering formula and how wavelength affects scattering intensity',
                'Define the visible spectrum (380-700 nm) and assign RGB values to each wavelength',
                'Calculate scattering intensity for each wavelength at various sun elevation angles',
                'Render a gradient image showing the sky color from horizon to zenith',
                'Compare your simulated sunset colors with photographs of actual Assam sunsets',
            ],
        },
    },
    'fishermans-daughter-storm': {
        'skills': [
            'Understand how cyclones form from warm ocean surfaces and low-pressure systems',
            'Read weather maps and interpret pressure isobars',
            'Analyze wind speed and storm surge data',
            'Model storm trajectories using historical datasets',
        ],
        'realWorld': [
            'Meteorologists use numerical weather prediction models to issue cyclone warnings 72 hours ahead',
            'Coastal engineers design flood barriers based on storm surge simulations',
            'Fishermen rely on weather radio and satellite alerts to decide when it is safe to go out',
        ],
        'project': {
            'title': 'Track and Visualize Historical Cyclone Paths',
            'description': 'Use real cyclone track data from the Bay of Bengal to plot storm paths, analyze wind speed trends, and identify the regions most at risk.',
            'steps': [
                'Download historical cyclone data from IMD or IBTrACS databases',
                'Parse the CSV data and extract latitude, longitude, wind speed, and pressure',
                'Plot cyclone tracks on a map of the Bay of Bengal using Matplotlib',
                'Color-code tracks by intensity category and annotate landfall points',
                'Calculate average cyclone frequency per decade and visualize the trend',
            ],
        },
    },
    'snow-leopards-promise': {
        'skills': [
            'Understand how atmospheric pressure and oxygen levels change with altitude',
            'Analyze temperature lapse rates in mountain environments',
            'Model altitude-dependent physiological responses like acclimatization',
            'Interpret topographic maps and elevation profiles',
        ],
        'realWorld': [
            'Mountain rescue teams use altitude sickness models to plan safe ascent rates',
            'Aircraft cabin pressurization systems compensate for reduced atmospheric pressure at cruising altitude',
            'Climate scientists study alpine ecosystems as early indicators of global temperature shifts',
        ],
        'project': {
            'title': 'Build an Altitude Effects Calculator',
            'description': 'Create a tool that calculates air pressure, oxygen availability, boiling point of water, and temperature at any given altitude on Khangchendzonga.',
            'steps': [
                'Research the barometric formula relating altitude to atmospheric pressure',
                'Implement calculations for pressure, O2 partial pressure, and boiling point vs altitude',
                'Plot these variables from sea level to 8,586 m (Khangchendzonga summit)',
                'Add markers for key altitudes: base camp, acclimatization zones, death zone',
                'Validate your model against published data from high-altitude research stations',
            ],
        },
    },
    'map-makers-granddaughter': {
        'skills': [
            'Understand coordinate systems, projections, and map scales',
            'Use GIS tools to overlay geographic data layers',
            'Convert between latitude/longitude and grid references',
            'Analyze spatial data to identify geographic patterns',
        ],
        'realWorld': [
            'Urban planners use GIS to decide where to build schools, hospitals, and roads',
            'Disaster response teams create real-time maps of flood extent from satellite imagery',
            'Delivery companies optimize routes using geographic information systems',
        ],
        'project': {
            'title': 'Create a Digital Map of Your Neighborhood',
            'description': 'Build an interactive map using Python that plots landmarks, paths, and points of interest in your local area with proper geographic coordinates.',
            'steps': [
                'Collect GPS coordinates of 10-15 landmarks in your neighborhood using a phone',
                'Research map projections and choose one appropriate for your region',
                'Plot the points on a map using Matplotlib or Folium',
                'Add labels, icons, and a legend to make the map readable',
                'Calculate distances between landmarks and add a scale bar',
            ],
        },
    },
    'old-banyan-trees-stories': {
        'skills': [
            'Understand tree ring analysis (dendrochronology) for dating and climate study',
            'Analyze how trees transport water from roots to canopy via transpiration',
            'Model tree growth rates under different environmental conditions',
            'Identify symbiotic relationships between trees and other organisms',
        ],
        'realWorld': [
            'Dendrochronologists date ancient buildings and archaeological sites using tree ring patterns',
            'Forest managers use growth models to plan sustainable timber harvesting',
            'Urban planners select tree species for cities based on carbon sequestration rates and canopy spread',
        ],
        'project': {
            'title': 'Analyze Tree Growth Using Ring Data',
            'description': 'Study tree ring width data to reconstruct historical climate patterns and calculate the growth rate and age of a banyan tree.',
            'steps': [
                'Find or create a dataset of tree ring widths from a sample core',
                'Plot ring width over time to visualize growth patterns',
                'Identify years of drought or abundant rainfall from narrow and wide rings',
                'Calculate the average annual growth rate and estimate total tree age',
                'Compare your findings with known climate events in the region',
            ],
        },
    },
    'tigers-whisker': {
        'skills': [
            'Understand how mechanoreceptors convert physical stimuli into nerve signals',
            'Analyze sensory range and sensitivity across different animal species',
            'Model signal propagation in nerve fibers',
            'Compare human and animal sensory capabilities quantitatively',
        ],
        'realWorld': [
            'Roboticists design whisker-like tactile sensors for robots that navigate dark environments',
            'Medical engineers develop prosthetic limbs with pressure-sensitive feedback systems',
            'Autonomous vehicles use LIDAR in a scanning pattern inspired by animal whisker sweeping',
        ],
        'project': {
            'title': 'Map Animal Sensory Ranges',
            'description': 'Build a comparative visualization of sensory capabilities across species — hearing ranges, vision spectra, and tactile sensitivity.',
            'steps': [
                'Research sensory data for 8-10 animals: hearing range, vision spectrum, whisker sensitivity',
                'Organize the data into a structured table with consistent units',
                'Create bar charts comparing hearing ranges across species',
                'Build a color-spectrum visualization showing each animal\'s visible light range',
                'Write a summary of which senses each animal relies on most and why',
            ],
        },
    },
    'basket-weavers-song': {
        'skills': [
            'Identify mathematical patterns in traditional weaving: symmetry, tessellation, and repetition',
            'Calculate pattern ratios and geometric proportions in woven designs',
            'Analyze the relationship between weave structure and material strength',
            'Use modular arithmetic to model repeating pattern cycles',
        ],
        'realWorld': [
            'Textile engineers use mathematical models to design fabrics with specific strength and flexibility',
            'Computer graphics artists generate procedural patterns using the same math found in weaving',
            'Material scientists study woven composites like carbon fiber for aerospace applications',
        ],
        'project': {
            'title': 'Generate Weaving Patterns Algorithmically',
            'description': 'Write a program that generates traditional Northeast Indian weaving patterns using mathematical rules for symmetry and repetition.',
            'steps': [
                'Study 5-6 traditional Assamese weaving patterns and identify their mathematical structure',
                'Define a grid system where each cell is either warp-up or weft-up',
                'Implement symmetry operations: reflection, rotation, and translation',
                'Generate patterns by combining these operations with different base motifs',
                'Render the patterns as colored grid images and compare with real textiles',
            ],
        },
    },
    'honey-hunters-lesson': {
        'skills': [
            'Understand bee colony structure: queen, workers, drones and their roles',
            'Analyze the waggle dance as a communication system encoding distance and direction',
            'Model pollination networks connecting plants and their pollinators',
            'Calculate honey production rates from foraging data',
        ],
        'realWorld': [
            'Agricultural scientists manage pollination services worth billions of dollars annually',
            'Robotics researchers build bee-inspired drones for pollinating crops in greenhouses',
            'Epidemiologists study colony collapse disorder to protect global food security',
        ],
        'project': {
            'title': 'Simulate a Bee Colony Foraging Network',
            'description': 'Model how bees communicate flower locations through waggle dances and optimize foraging routes across a landscape.',
            'steps': [
                'Place flower patches at random coordinates on a 2D map with varying nectar values',
                'Simulate scout bees discovering patches and encoding distance/direction in waggle dances',
                'Model follower bees interpreting dance data with some noise (imperfect communication)',
                'Track total nectar collected over time and visualize foraging paths',
                'Compare random foraging vs waggle-dance-guided foraging efficiency',
            ],
        },
    },
    'bamboo-taught-wind': {
        'skills': [
            'Understand resonance, natural frequency, and harmonic overtones',
            'Analyze standing wave patterns in tubes and strings',
            'Calculate resonant frequencies from tube length and diameter',
            'Model how damping affects vibration amplitude over time',
        ],
        'realWorld': [
            'Musical instrument designers use resonance calculations to tune bamboo flutes and organ pipes',
            'Structural engineers avoid resonance frequencies in bridge design to prevent catastrophic oscillation',
            'Audio engineers shape room acoustics by calculating standing wave modes',
        ],
        'project': {
            'title': 'Build a Resonant Frequency Calculator for Bamboo Tubes',
            'description': 'Calculate and visualize the fundamental and harmonic frequencies of bamboo tubes of different lengths, and compare predictions with actual flute notes.',
            'steps': [
                'Research the physics of open and closed tube resonance',
                'Measure or research the inner diameter and length of various bamboo flutes',
                'Calculate the fundamental frequency and first 4 harmonics for each tube',
                'Plot frequency vs tube length and compare with the musical scale',
                'Test predictions by comparing with audio recordings of actual bamboo flutes',
            ],
        },
    },
    'woodpeckers-drum': {
        'skills': [
            'Analyze impact forces and deceleration during repeated head strikes',
            'Understand shock-absorbing biological structures: spongy bone, hyoid apparatus',
            'Model stress distribution in layered composite materials',
            'Calculate g-forces experienced during rapid deceleration',
        ],
        'realWorld': [
            'Helmet designers study woodpecker skull structure to improve concussion protection',
            'Aerospace engineers use bio-inspired shock absorption in spacecraft landing systems',
            'Neurologists research woodpecker brain protection to understand human traumatic brain injury',
        ],
        'project': {
            'title': 'Model Woodpecker Impact Forces',
            'description': 'Calculate the g-forces a woodpecker experiences during drumming and compare its biological shock absorbers with human-engineered helmets.',
            'steps': [
                'Research woodpecker drumming speed (strikes per second) and deceleration values',
                'Calculate the g-force using F = ma for each impact',
                'Model the role of the hyoid bone, spongy skull, and brain fluid as shock absorbers',
                'Compare woodpecker g-force tolerance with human concussion thresholds',
                'Visualize the force-absorption chain as a layered diagram',
            ],
        },
    },
    'the-little-boat': {
        'skills': [
            'Understand Archimedes\' principle and why objects float or sink',
            'Calculate buoyant force from fluid density and displaced volume',
            'Analyze how hull shape affects stability and drag',
            'Model the effect of water absorption on paper boat buoyancy over time',
        ],
        'realWorld': [
            'Naval architects design ship hulls using computational fluid dynamics simulations',
            'Cargo logistics depends on calculating displacement to ensure safe loading',
            'Oceanographers deploy buoyant drifters to map ocean currents globally',
        ],
        'project': {
            'title': 'Simulate Paper Boat Buoyancy and Degradation',
            'description': 'Model how a paper boat floats on water, and simulate how water absorption gradually reduces buoyancy until the boat sinks.',
            'steps': [
                'Calculate the buoyant force on a folded paper boat given its dimensions and paper density',
                'Model water absorption rate as a function of time and paper type',
                'Simulate the decreasing freeboard (height above water) as the paper gets heavier',
                'Plot a timeline showing when the boat becomes unstable and sinks',
                'Test different paper types (newspaper, cardstock, wax-coated) and compare survival times',
            ],
        },
    },
    'the-hornbills-crown': {
        'skills': [
            'Understand bird social hierarchies and cooperative breeding behavior',
            'Analyze the role of casque structure in hornbill biology',
            'Model population dynamics of keystone species in forest ecosystems',
            'Interpret field observation data on animal behavior',
        ],
        'realWorld': [
            'Wildlife biologists use camera traps and GPS trackers to study hornbill movement and nesting',
            'Conservation planners prioritize hornbill habitat because they are seed dispersers for dozens of tree species',
            'Biomaterials researchers study the hornbill casque — lightweight yet strong — for engineering applications',
        ],
        'project': {
            'title': 'Analyze Hornbill Nesting and Seed Dispersal Data',
            'description': 'Use field data on hornbill nesting sites and fruit consumption to map their role as seed dispersers in Nagaland forests.',
            'steps': [
                'Compile data on hornbill diet — which fruits they eat and seed sizes they disperse',
                'Map nesting locations and foraging ranges from published field studies',
                'Calculate seed dispersal distances based on flight range and gut retention time',
                'Visualize the seed shadow — the area around a nest where seeds are likely deposited',
                'Assess what would happen to forest regeneration if hornbills disappeared',
            ],
        },
    },
    'why-fish-jump': {
        'skills': [
            'Understand dissolved oxygen levels and their effect on fish behavior',
            'Analyze the physics of jumping — thrust, trajectory, and splash-down forces',
            'Model oxygen diffusion across the water-air interface',
            'Interpret seasonal patterns in fish activity from observation data',
        ],
        'realWorld': [
            'Fisheries scientists monitor dissolved oxygen to predict fish kills and manage water quality',
            'Hydroelectric dam designers include fish ladders based on species-specific jumping ability',
            'Aquaculture engineers maintain optimal oxygen levels in fish farms using aeration systems',
        ],
        'project': {
            'title': 'Model Fish Jump Trajectories and Oxygen Triggers',
            'description': 'Calculate the physics of a fish leap and correlate jumping frequency with dissolved oxygen and temperature data.',
            'steps': [
                'Research why fish jump: parasite removal, oxygen intake, predator escape, and obstacle clearing',
                'Model a fish jump as projectile motion given body mass, thrust force, and launch angle',
                'Plot maximum jump height vs body length for several river fish species',
                'Graph dissolved oxygen levels across seasons and overlay with observed jumping frequency',
                'Identify the oxygen threshold below which jumping behavior increases',
            ],
        },
    },
    'tortoise-and-hare': {
        'skills': [
            'Calculate speed, velocity, and acceleration from distance-time data',
            'Understand metabolic rate scaling with body size',
            'Model trade-offs between speed and endurance in animal locomotion',
            'Analyze motion graphs: position-time, velocity-time, and acceleration-time',
        ],
        'realWorld': [
            'Sports scientists use motion analysis to optimize sprinting technique and pacing strategy',
            'Autonomous vehicle engineers model acceleration curves for safe braking distances',
            'Ecologists study animal movement speed to predict home range sizes and migration patterns',
        ],
        'project': {
            'title': 'Simulate a Race Between Animals of Different Speeds',
            'description': 'Build a physics-based race simulator that models speed, acceleration, stamina, and rest periods for different animals.',
            'steps': [
                'Research top speed, acceleration, and endurance data for 6-8 animals (tortoise, hare, rhino, etc.)',
                'Define a race course with distance and terrain factors',
                'Model each animal with speed, acceleration, stamina depletion, and rest recovery rates',
                'Simulate the race step-by-step and plot position vs time for all contestants',
                'Determine which animal wins at different race distances and explain why',
            ],
        },
    },
    'red-panda-mask': {
        'skills': [
            'Understand natural selection and how camouflage patterns evolve',
            'Analyze the physics of light absorption and reflection in fur pigments',
            'Model predator-prey detection probability with and without camouflage',
            'Compare convergent evolution of mask-like markings across species',
        ],
        'realWorld': [
            'Military camouflage designers study animal coloration patterns for concealment technology',
            'Computer vision researchers train AI to detect camouflaged objects — a hard unsolved problem',
            'Conservation biologists use coat pattern recognition to identify individual animals from camera traps',
        ],
        'project': {
            'title': 'Test How Well Camouflage Works Against a Background',
            'description': 'Build an image analysis tool that measures how well an animal blends into its background by comparing color histograms.',
            'steps': [
                'Collect images of red pandas in different forest backgrounds',
                'Extract color histograms from the animal region and the background region',
                'Calculate a similarity score between the two histograms',
                'Repeat for other camouflaged animals (snow leopard on rocks, leaf insect on branches)',
                'Rank the animals by camouflage effectiveness and explain the results',
            ],
        },
    },
    'clouded-leopard': {
        'skills': [
            'Understand GPS telemetry and how wildlife trackers collect movement data',
            'Analyze home range estimation from coordinate data',
            'Model habitat connectivity using corridor analysis',
            'Interpret population viability under different conservation scenarios',
        ],
        'realWorld': [
            'Wildlife biologists collar endangered cats with GPS to map their territories and migration routes',
            'Conservation NGOs use habitat models to propose wildlife corridors between fragmented forests',
            'Government agencies use population viability analysis to set hunting quotas and protection levels',
        ],
        'project': {
            'title': 'Map Wildlife Movement from GPS Tracking Data',
            'description': 'Use simulated GPS collar data to estimate a clouded leopard\'s home range, identify core areas, and detect habitat barriers.',
            'steps': [
                'Generate or find GPS coordinate data simulating a clouded leopard\'s weekly movements',
                'Plot all coordinates on a map and identify clusters (resting sites, hunting grounds)',
                'Calculate the home range using minimum convex polygon and kernel density methods',
                'Identify barriers (roads, rivers, cleared land) the animal avoids',
                'Propose a wildlife corridor connecting two fragmented habitat patches',
            ],
        },
    },
    'peacocks-dance': {
        'skills': [
            'Understand animal signaling theory: honest signals, costly displays, and sexual selection',
            'Analyze barometric pressure changes as storm indicators',
            'Model the relationship between weather variables and animal behavior',
            'Design observational studies with controls and measurable outcomes',
        ],
        'realWorld': [
            'Farmers in India use animal behavior cues (peacock calls, ant movements) as informal weather predictors',
            'Behavioral ecologists study costly signaling to understand how animals communicate fitness',
            'Weather prediction apps combine barometric data with historical patterns for short-term forecasts',
        ],
        'project': {
            'title': 'Correlate Animal Behavior with Weather Data',
            'description': 'Collect local weather data and animal behavior observations to test whether animals really can predict rain.',
            'steps': [
                'Set up a data collection sheet: date, temperature, humidity, barometric pressure, observed animal behavior',
                'Collect 2-4 weeks of daily weather readings from an online weather API',
                'Record any observable animal behavior changes (bird calls, insect activity, pet behavior)',
                'Plot weather variables against behavior observations and look for correlations',
                'Calculate the correlation coefficient and assess whether the pattern is statistically significant',
            ],
        },
    },
    'elephant-mud-bath': {
        'skills': [
            'Understand thermoregulation strategies: evaporative cooling, mud coating, ear flapping',
            'Calculate heat loss through different cooling mechanisms',
            'Model body temperature regulation as a feedback control system',
            'Analyze surface-area-to-volume ratio and its effect on heat retention',
        ],
        'realWorld': [
            'Building engineers design passive cooling systems inspired by elephant ear blood flow patterns',
            'Zoo veterinarians monitor elephant body temperature to detect illness early',
            'Thermal imaging cameras help wildlife researchers study animal thermoregulation in the wild',
        ],
        'project': {
            'title': 'Model Elephant Thermoregulation',
            'description': 'Build a simulation that calculates an elephant\'s body temperature based on ambient conditions, activity level, and cooling behaviors.',
            'steps': [
                'Research elephant thermoregulation: ear flapping, mud bathing, shade seeking, and water spraying',
                'Model heat gain from metabolism and solar radiation as a function of body mass',
                'Model heat loss from each cooling behavior with realistic transfer coefficients',
                'Simulate body temperature over a hot day with and without mud-bathing',
                'Plot temperature curves and identify the tipping point where overheating occurs',
            ],
        },
    },
    'brave-mithun': {
        'skills': [
            'Understand selective breeding and how humans shape animal traits over generations',
            'Analyze genetic diversity using simple population genetics models',
            'Compare wild ancestors with domesticated breeds quantitatively',
            'Model trait inheritance using Mendelian genetics and Punnett squares',
        ],
        'realWorld': [
            'Livestock geneticists use selective breeding data to improve disease resistance in cattle',
            'Conservation programs maintain genetic diversity in endangered species through managed breeding',
            'Agricultural scientists breed drought-resistant crop varieties using the same principles',
        ],
        'project': {
            'title': 'Simulate Selective Breeding Over Generations',
            'description': 'Model how selecting for specific traits (size, temperament, coat color) changes a population over 20 generations.',
            'steps': [
                'Define a starting population with random values for 3 traits (size, strength, temperament)',
                'Implement a selection rule: only the top 30% breed each generation',
                'Simulate trait inheritance with random variation (mutation and recombination)',
                'Run the simulation for 20 generations and plot average trait values over time',
                'Compare the outcome of selecting for one trait vs multiple traits simultaneously',
            ],
        },
    },
    'cuckoo-calls-dawn': {
        'skills': [
            'Understand circadian rhythms and the molecular clock in organisms',
            'Analyze sunrise timing data across seasons and latitudes',
            'Model how light intensity triggers behavioral responses in birds',
            'Interpret time-series data on animal vocalizations',
        ],
        'realWorld': [
            'Sleep researchers study circadian rhythms to treat jet lag and shift-work disorders',
            'Agricultural scientists time crop treatments based on plant circadian cycles for maximum uptake',
            'Smart lighting systems mimic natural dawn to improve human wakefulness and mood',
        ],
        'project': {
            'title': 'Track Dawn Chorus Timing Across Seasons',
            'description': 'Collect or research data on when birds start singing relative to sunrise, and model how day length drives the dawn chorus.',
            'steps': [
                'Research sunrise times for your location across all 12 months',
                'Find published data on dawn chorus start times for 4-5 bird species',
                'Plot bird singing onset vs sunrise time and measure the offset',
                'Model how changing day length shifts the circadian trigger for singing',
                'Predict when each species will start calling on any given date',
            ],
        },
    },
    'orchid-colors': {
        'skills': [
            'Understand how pigments (anthocyanins, carotenoids, chlorophyll) produce flower colors',
            'Analyze UV reflectance patterns invisible to humans but visible to pollinators',
            'Model the co-evolution of flower color and pollinator vision',
            'Measure and compare color spectra using basic spectrophotometry concepts',
        ],
        'realWorld': [
            'Horticulturists breed flower varieties with specific colors by manipulating pigment gene expression',
            'Food scientists use plant-derived pigments as natural food colorings',
            'Pollination ecologists map UV flower patterns to understand which insects visit which flowers',
        ],
        'project': {
            'title': 'Map the Color Spectrum of Local Flowers',
            'description': 'Photograph and analyze the color distribution of flowers in your area, linking pigment types to the pollinators they attract.',
            'steps': [
                'Photograph 10-15 different flowers in consistent lighting conditions',
                'Extract dominant colors from each image using Python and k-means clustering',
                'Research which pigment (anthocyanin, carotenoid, betalain) produces each color',
                'Map each flower to its primary pollinator (bee, butterfly, bird, moth)',
                'Create a chart showing the correlation between flower color and pollinator type',
            ],
        },
    },
    'pitcher-plant': {
        'skills': [
            'Understand how carnivorous plants supplement nutrient-poor soil with insect prey',
            'Analyze the fluid dynamics of pitcher plant traps: wettability and slippery surfaces',
            'Model nitrogen budgets comparing root uptake vs prey digestion',
            'Design experiments to test trap efficiency under different conditions',
        ],
        'realWorld': [
            'Biomimetic engineers design anti-fouling surfaces inspired by the slippery rim of pitcher plants',
            'Ecologists study carnivorous plants as indicators of nutrient-poor, undisturbed ecosystems',
            'Pharmaceutical researchers investigate the digestive enzymes of pitcher plants for medical applications',
        ],
        'project': {
            'title': 'Measure Pitcher Plant Trap Efficiency',
            'description': 'Design and analyze an experiment testing how pitcher shape, fluid viscosity, and rim angle affect prey capture rates.',
            'steps': [
                'Research the mechanical trapping mechanism: the peristome, wax crystals, and digestive fluid',
                'Build simple pitcher models from paper or plastic with different rim angles and depths',
                'Test each model by dropping small objects (simulating insects) and recording capture rates',
                'Analyze which design variables most affect capture efficiency',
                'Compare your results with published data on real pitcher plant species',
            ],
        },
    },
    'bamboo-grows-fast': {
        'skills': [
            'Understand cell elongation, turgor pressure, and the role of growth hormones (auxins, gibberellins)',
            'Calculate growth rates and compare them across plant species',
            'Model exponential vs linear growth phases in plants',
            'Analyze how environmental factors (light, water, temperature) affect growth speed',
        ],
        'realWorld': [
            'Bamboo is used as a sustainable building material growing 30x faster than hardwood trees',
            'Bioenergy researchers study fast-growing plants as renewable biomass fuel sources',
            'Agricultural scientists apply growth hormone research to increase crop yields',
        ],
        'project': {
            'title': 'Track and Model Plant Growth Rates',
            'description': 'Measure the daily growth of a fast-growing plant and fit mathematical models to the data.',
            'steps': [
                'Choose a fast-growing plant (bean sprout, bamboo shoot, or sunflower) and plant it',
                'Measure and record height daily at the same time for 3-4 weeks',
                'Plot height vs time and identify the growth phases: lag, exponential, and plateau',
                'Fit a logistic growth curve to the data using Python',
                'Compare your plant\'s growth rate with published bamboo growth rates (up to 91 cm/day)',
            ],
        },
    },
    'sal-tree': {
        'skills': [
            'Understand wood microstructure: cellulose fibers, lignin, and their role in strength',
            'Analyze material properties: tensile strength, elasticity, and hardness',
            'Model stress and strain in beams under different loads',
            'Compare wood density and strength across tropical timber species',
        ],
        'realWorld': [
            'Civil engineers select timber species based on strength-to-weight ratios for construction',
            'Material scientists develop engineered wood products (plywood, laminated beams) using fiber alignment principles',
            'Forestry managers balance harvesting rates with growth rates to maintain forest health',
        ],
        'project': {
            'title': 'Compare Wood Strength Across Tree Species',
            'description': 'Research and visualize the material properties of different wood types, explaining why some trees bend and others break.',
            'steps': [
                'Collect published data on density, tensile strength, and elasticity for 8-10 wood species',
                'Create a scatter plot of strength vs density and look for patterns',
                'Research the microstructure differences that explain why sal wood is so rigid',
                'Model a simple beam under load and calculate deflection for different wood types',
                'Rank the woods by suitability for different purposes: building, furniture, boat-making',
            ],
        },
    },
    'tiny-frog': {
        'skills': [
            'Understand allometric scaling — how body proportions change with size',
            'Analyze the physics of miniaturization: surface tension, heat loss, and diffusion limits',
            'Model how metabolic rate scales with body mass across species',
            'Interpret species discovery data and biodiversity hotspot analysis',
        ],
        'realWorld': [
            'Pharmaceutical researchers study miniature frogs whose skin toxins show medicinal potential',
            'Engineers apply allometric scaling laws when miniaturizing robots and sensors',
            'Biologists discover hundreds of new tiny species each year in tropical rainforests',
        ],
        'project': {
            'title': 'Explore How Body Size Affects Biology',
            'description': 'Plot metabolic rate, lifespan, heart rate, and other biological variables against body mass across species to discover scaling laws.',
            'steps': [
                'Compile body mass and metabolic rate data for 15-20 animals from insects to elephants',
                'Plot metabolic rate vs body mass on a log-log scale',
                'Fit a power law (Kleiber\'s law) and calculate the scaling exponent',
                'Repeat for heart rate and lifespan vs body mass',
                'Predict the metabolic rate of the tiny rainforest frog from your model and check against data',
            ],
        },
    },
    'the-girl-who-painted-rain': {
        'skills': [
            'Understand how white light separates into colors through refraction and dispersion',
            'Analyze the physics of rainbows: angle of incidence, total internal reflection',
            'Model color mixing: additive (light) vs subtractive (pigments)',
            'Measure and compare color properties: hue, saturation, and brightness',
        ],
        'realWorld': [
            'Display engineers use color science to calibrate screens for accurate color reproduction',
            'Paint manufacturers formulate pigment mixtures using subtractive color theory',
            'Atmospheric scientists analyze rainbow and halo phenomena to study ice crystal shapes in clouds',
        ],
        'project': {
            'title': 'Build a Color Mixing Simulator',
            'description': 'Create an interactive tool that demonstrates additive and subtractive color mixing, and simulates rainbow formation.',
            'steps': [
                'Implement RGB additive mixing — overlapping colored lights on a dark background',
                'Implement CMYK subtractive mixing — overlapping pigments on a white background',
                'Model a raindrop as a sphere and trace light rays through it (refraction + reflection)',
                'Calculate the exit angle for each wavelength to show why rainbows always form at 42 degrees',
                'Visualize the full rainbow spectrum and compare with photographs of real rainbows',
            ],
        },
    },
    'cloud-weaver-of-tawang': {
        'skills': [
            'Understand fiber properties: tensile strength, elasticity, and moisture absorption',
            'Analyze loom mechanics: warp tension, shuttle motion, and beat-up force',
            'Model fabric structure at the thread level: plain weave, twill, satin',
            'Calculate thread count and fabric density from measurements',
        ],
        'realWorld': [
            'Textile engineers design fabrics with specific properties for sportswear, medical, and industrial use',
            'Smart textile researchers weave conductive fibers into cloth for wearable electronics',
            'Fashion technologists use digital looms programmed with pattern algorithms',
        ],
        'project': {
            'title': 'Analyze Fabric Structure Under Magnification',
            'description': 'Examine different fabrics to measure thread count, identify weave patterns, and test fabric strength.',
            'steps': [
                'Collect 5-6 fabric samples: cotton, silk, polyester, denim, muslin',
                'Photograph each under magnification and count threads per centimeter (warp and weft)',
                'Identify the weave pattern: plain, twill, or satin',
                'Test each fabric\'s strength by hanging weights until it tears (with adult supervision)',
                'Plot thread count vs strength and identify which weave pattern is strongest',
            ],
        },
    },
    'the-magic-japi-hat': {
        'skills': [
            'Identify geometric shapes in traditional designs: circles, cones, radial symmetry',
            'Calculate surface area and volume of conical and circular hat forms',
            'Analyze structural stability of curved vs flat surfaces',
            'Model how shape affects rain runoff and sun shading',
        ],
        'realWorld': [
            'Architects design curved roofs and domes using the same geometry found in traditional hats',
            'Product designers calculate surface area for material cost estimation',
            'Biomechanics engineers study how conical shapes distribute loads evenly',
        ],
        'project': {
            'title': 'Design an Optimal Sun Hat Using Geometry',
            'description': 'Use geometric calculations to design a hat that maximizes shade coverage while minimizing material and weight.',
            'steps': [
                'Measure the japi hat dimensions: base radius, cone height, brim width',
                'Calculate the surface area and the shadow it casts at different sun angles',
                'Model how brim angle affects rain runoff speed',
                'Design 3 alternative hat shapes and calculate their shade-to-material ratio',
                'Determine which design provides the best sun protection per gram of material',
            ],
        },
    },
    'star-fell-deepor': {
        'skills': [
            'Understand meteoroid entry physics: friction, ablation, and terminal velocity',
            'Analyze crater formation from impact energy and projectile size',
            'Classify meteorites by composition: iron, stony, and stony-iron',
            'Calculate orbital mechanics for near-Earth objects',
        ],
        'realWorld': [
            'Planetary defense agencies track near-Earth asteroids and model potential impact scenarios',
            'Geologists study impact craters to understand Earth\'s geological history',
            'Space mining companies assess asteroid mineral composition for future resource extraction',
        ],
        'project': {
            'title': 'Simulate Meteorite Entry and Impact',
            'description': 'Model a meteoroid entering Earth\'s atmosphere, calculate its deceleration, heating, and final impact energy.',
            'steps': [
                'Research typical meteoroid entry speeds (11-72 km/s) and compositions',
                'Model atmospheric drag and ablation as the meteoroid descends',
                'Calculate the kinetic energy at impact for different initial masses and speeds',
                'Estimate crater size using scaling laws from impact physics',
                'Compare your model predictions with real crater data (Lonar crater, Barringer crater)',
            ],
        },
    },
    'kite-festival': {
        'skills': [
            'Understand lift, drag, and the forces acting on a kite in flight',
            'Analyze the effect of angle of attack on aerodynamic performance',
            'Calculate wind speed requirements for stable kite flight',
            'Model flight stability using center of pressure and center of gravity',
        ],
        'realWorld': [
            'Wind energy companies test airborne kite generators that harvest wind power at high altitudes',
            'Aerospace engineers use kite-like tethered drones for atmospheric sampling',
            'Kitesurfing equipment designers optimize kite shape for maximum lift and control',
        ],
        'project': {
            'title': 'Design and Test Kites for Maximum Lift',
            'description': 'Build kites of different shapes and measure their flight performance to discover which design generates the most lift.',
            'steps': [
                'Research the four forces on a kite: weight, tension, lift, and drag',
                'Build 3 kites of different shapes: diamond, delta, and box, using identical materials',
                'Fly each kite and measure line angle (as a proxy for lift-to-drag ratio)',
                'Record wind speed during each test using a simple anemometer',
                'Plot line angle vs wind speed for each design and determine the best performer',
            ],
        },
    },
    'grandmothers-pitha': {
        'skills': [
            'Understand the Maillard reaction, caramelization, and how heat transforms food chemistry',
            'Analyze the role of gluten, starch, and fat in dough texture',
            'Model fermentation as a biological and chemical process',
            'Calculate nutritional content from ingredient proportions',
        ],
        'realWorld': [
            'Food scientists engineer processed foods by controlling Maillard reaction rates',
            'Bakers use precise temperature and humidity control for consistent bread quality',
            'Nutritionists calculate dietary balance using food composition databases',
        ],
        'project': {
            'title': 'Experiment With the Science of Baking',
            'description': 'Test how changing ingredients (flour type, sugar amount, cooking temperature) affects the texture, color, and taste of pitha.',
            'steps': [
                'Choose a simple pitha recipe and identify the key variables: flour ratio, sugar, cooking time',
                'Make 4 batches changing one variable at a time while keeping others constant',
                'Measure and record color (light to dark), texture (soft to crispy), and rise height',
                'Photograph each result and create a comparison chart',
                'Explain each result using food chemistry: Maillard reaction, gelatinization, caramelization',
            ],
        },
    },
    'lost-temple': {
        'skills': [
            'Understand archaeological dating methods: radiocarbon, stratigraphy, and thermoluminescence',
            'Analyze architectural patterns to estimate construction period',
            'Model erosion and weathering rates to estimate exposure age',
            'Interpret spatial data from excavation grids',
        ],
        'realWorld': [
            'Archaeologists use LIDAR to discover ancient structures hidden under forest canopy',
            'Museums use radiocarbon dating to authenticate artifacts and establish timelines',
            'Forensic scientists apply the same dating techniques to solve criminal cases',
        ],
        'project': {
            'title': 'Date an Archaeological Site Using Multiple Methods',
            'description': 'Simulate the process of dating a lost temple by analyzing pottery styles, stone weathering, and simulated radiocarbon data.',
            'steps': [
                'Research common dating methods and their applicable time ranges',
                'Create a simulated excavation grid with artifacts at different depths',
                'Apply stratigraphy rules: deeper layers are older (law of superposition)',
                'Use a simulated radiocarbon decay curve to date organic material from each layer',
                'Cross-reference all methods to establish a timeline for the site',
            ],
        },
    },
    'seven-sisters': {
        'skills': [
            'Read and create thematic maps: topographic, political, climate, and vegetation',
            'Calculate area and perimeter of irregular geographic regions',
            'Analyze demographic data across regions using choropleth maps',
            'Understand how physical geography (rivers, mountains) shapes political boundaries',
        ],
        'realWorld': [
            'Census analysts create maps showing population density and resource distribution',
            'Border commissions use geographic features and historical maps to resolve territorial disputes',
            'Urban planners use elevation and flood plain maps to decide where to allow construction',
        ],
        'project': {
            'title': 'Build a Comparative Atlas of the Seven Sister States',
            'description': 'Create thematic maps comparing the eight northeastern states across area, population, elevation, rainfall, and biodiversity.',
            'steps': [
                'Collect data for each state: area, population, highest peak, annual rainfall, number of endemic species',
                'Create a choropleth map color-coded by population density',
                'Create a bar chart comparing area and population side by side',
                'Plot elevation profiles along a transect from Assam plains to Arunachal peaks',
                'Write a geographic summary explaining why each state has distinct physical characteristics',
            ],
        },
    },
    'little-potter': {
        'skills': [
            'Understand the chemistry of clay: silicates, water content, and plasticity',
            'Analyze how firing temperature transforms clay into ceramic (sintering)',
            'Model thermal expansion and contraction during the firing process',
            'Compare material properties of earthenware, stoneware, and porcelain',
        ],
        'realWorld': [
            'Ceramic engineers develop heat-resistant tiles for spacecraft reentry shields',
            'Dental technicians use ceramic science to create realistic and durable tooth crowns',
            'Electronics manufacturers use ceramics as insulators in circuit boards and capacitors',
        ],
        'project': {
            'title': 'Test How Firing Temperature Changes Clay Properties',
            'description': 'Investigate how different drying and baking conditions affect the hardness, porosity, and color of clay samples.',
            'steps': [
                'Prepare 6 identical clay samples of the same size and shape',
                'Dry two at room temperature, bake two at low oven temperature, bake two at high temperature',
                'Test hardness by scratching with a nail and rating resistance',
                'Test water absorption by weighing before and after soaking for 1 hour',
                'Record color changes and create a table comparing all properties across temperatures',
            ],
        },
    },
    'monkey-bridge': {
        'skills': [
            'Understand primate locomotion: brachiation, leaping, and bridge-forming behavior',
            'Analyze forest canopy connectivity and its importance for arboreal species',
            'Model network connectivity — treating trees as nodes and branches as edges',
            'Calculate structural loads on natural and artificial canopy bridges',
        ],
        'realWorld': [
            'Conservation engineers install rope bridges across roads to reconnect fragmented canopy for primates',
            'Network scientists use the same graph theory to model internet connectivity and social networks',
            'Forestry researchers use canopy connectivity maps to assess habitat quality for arboreal species',
        ],
        'project': {
            'title': 'Model Forest Canopy Connectivity as a Network',
            'description': 'Create a graph model of a forest where trees are nodes and overlapping canopies are edges, then analyze how deforestation fragments the network.',
            'steps': [
                'Place 20-30 trees at random positions on a 2D map with canopy radius for each',
                'Connect trees whose canopies overlap (distance < sum of radii)',
                'Visualize the network and identify connected components',
                'Simulate deforestation by removing trees one by one and tracking when the network fragments',
                'Identify the most critical trees — those whose removal disconnects the most area',
            ],
        },
    },
    'boy-counted-butterflies': {
        'skills': [
            'Design systematic data collection protocols: transect surveys, point counts',
            'Apply basic statistical analysis: mean, median, standard deviation',
            'Create data visualizations: bar charts, scatter plots, time series',
            'Understand sampling bias and how to minimize it',
        ],
        'realWorld': [
            'Citizen science platforms like iNaturalist and eBird collect millions of species observations annually',
            'Ecologists use butterfly population counts as indicators of ecosystem health',
            'Conservation agencies set policy based on long-term population monitoring data',
        ],
        'project': {
            'title': 'Conduct a Butterfly Population Survey',
            'description': 'Design and carry out a citizen science survey counting butterflies in your area, then analyze the data for patterns.',
            'steps': [
                'Choose a survey site and define a walking transect of 200-500 meters',
                'Walk the transect at a consistent pace, recording every butterfly seen (species if possible, otherwise color)',
                'Repeat the survey 5-7 times over 2 weeks at the same time of day',
                'Calculate average count, species richness, and day-to-day variation',
                'Plot results and investigate what factors (weather, flowers in bloom) affect butterfly numbers',
            ],
        },
    },
    'monsoon-home': {
        'skills': [
            'Understand monsoon mechanics: differential heating of land and ocean, Coriolis effect',
            'Analyze rainfall data and identify monsoon onset and withdrawal dates',
            'Model the Indian Ocean Dipole and its effect on monsoon strength',
            'Interpret satellite imagery of cloud cover and moisture transport',
        ],
        'realWorld': [
            'Agricultural planners schedule planting and harvesting around monsoon forecast dates',
            'Flood management agencies use monsoon models to pre-position relief supplies',
            'Insurance companies price crop insurance based on monsoon variability predictions',
        ],
        'project': {
            'title': 'Analyze Monsoon Rainfall Patterns Over Decades',
            'description': 'Download historical rainfall data for Assam and analyze how monsoon timing and intensity have changed over 30+ years.',
            'steps': [
                'Download monthly rainfall data for an Assam weather station from IMD or open data sources',
                'Plot monthly rainfall for several years and identify the monsoon months (June-September)',
                'Calculate the monsoon onset date each year (first month exceeding a rainfall threshold)',
                'Plot the trend in total monsoon rainfall over the decades',
                'Assess whether the monsoon is getting stronger, weaker, or more variable',
            ],
        },
    },
    'grandmother-remembered': {
        'skills': [
            'Understand how memory formation works: encoding, consolidation, and retrieval',
            'Analyze the neuroscience of long-term vs short-term memory',
            'Model memory decay curves (Ebbinghaus forgetting curve)',
            'Design experiments to test memory performance under different conditions',
        ],
        'realWorld': [
            'Educational psychologists design spaced repetition systems (like Anki) based on forgetting curves',
            'Neurologists use memory tests to diagnose and monitor Alzheimer\'s disease progression',
            'AI researchers build neural network memory systems inspired by human hippocampal function',
        ],
        'project': {
            'title': 'Test Your Own Forgetting Curve',
            'description': 'Run a self-experiment to measure how quickly you forget a list of words, and compare your results with Ebbinghaus\'s original data.',
            'steps': [
                'Memorize a list of 20 random words and test recall immediately (record the score)',
                'Re-test at intervals: 1 hour, 1 day, 3 days, 1 week (without re-studying)',
                'Plot your recall percentage vs time elapsed',
                'Fit an exponential decay curve to your data',
                'Compare your forgetting curve with published data and discuss what affects memory retention',
            ],
        },
    },
    'singing-bamboo': {
        'skills': [
            'Understand standing waves in open and closed tubes',
            'Calculate the relationship between tube length, diameter, and pitch',
            'Analyze harmonic series and overtone production',
            'Model how wind speed and angle affect sound production in natural pipes',
        ],
        'realWorld': [
            'Organ builders use tube resonance physics to design pipes of precise pitch',
            'Noise control engineers model wind-induced sound in buildings and power line cables',
            'Musical acousticians study indigenous bamboo instruments for digital sound synthesis',
        ],
        'project': {
            'title': 'Build and Tune a Set of Bamboo Wind Chimes',
            'description': 'Cut bamboo tubes to calculated lengths to produce a musical scale, then verify the notes with a tuner app.',
            'steps': [
                'Research the resonant frequency formula for open tubes: f = v / 2L',
                'Calculate the tube lengths needed for a C major scale (C4 to C5)',
                'Cut bamboo or PVC tubes to the calculated lengths',
                'Hang the tubes and strike them, recording the pitch with a tuner app',
                'Compare measured vs predicted frequencies and discuss sources of error',
            ],
        },
    },
    'festival-lights': {
        'skills': [
            'Understand how different light sources work: incandescent, LED, oil lamp, fluorescent',
            'Calculate electrical energy consumption and compare light efficiency (lumens per watt)',
            'Analyze the electromagnetic spectrum and visible light wavelengths',
            'Model light intensity decay with distance (inverse square law)',
        ],
        'realWorld': [
            'Lighting designers calculate lumens and color temperature for homes, offices, and stages',
            'Solar engineers design off-grid lighting for rural communities using efficient LEDs',
            'City planners balance street lighting needs with energy costs and light pollution concerns',
        ],
        'project': {
            'title': 'Compare Light Source Efficiency',
            'description': 'Measure and compare the brightness, energy use, and color of different light sources to determine which is most efficient.',
            'steps': [
                'Gather light sources: candle, oil lamp (or simulation), incandescent bulb, LED bulb',
                'Measure brightness at a fixed distance using a phone light meter app',
                'Record the power consumption (watts) of each electrical source',
                'Calculate lumens-per-watt efficiency for each source',
                'Create a comparison chart and explain why LEDs are replacing older technologies',
            ],
        },
    },
    'little-train': {
        'skills': [
            'Understand mechanical advantage, gear ratios, and how steam/diesel engines produce motion',
            'Calculate gradient (slope) and its effect on required tractive effort',
            'Model the trade-off between speed and pulling force on steep gradients',
            'Analyze railway route design: curves, switchbacks, and gauge',
        ],
        'realWorld': [
            'Railway engineers design track gradients and curves for mountain railways worldwide',
            'Logistics companies calculate fuel costs based on gradient and load weight',
            'Heritage railway preservationists maintain century-old narrow-gauge lines as engineering landmarks',
        ],
        'project': {
            'title': 'Calculate the Physics of a Mountain Railway',
            'description': 'Model the forces on a train climbing a hill: gravity, friction, engine force, and determine the maximum gradient it can handle.',
            'steps': [
                'Research the specifications of a narrow-gauge hill train (weight, engine power, wheel friction)',
                'Calculate the gravitational component along slopes of 1%, 3%, 5%, and 8% gradient',
                'Add rolling friction and air resistance to find total force required at each gradient',
                'Determine the maximum gradient the engine can climb at various speeds',
                'Plot speed vs gradient and identify why hill railways use switchbacks and loops',
            ],
        },
    },
    'postman-hills': {
        'skills': [
            'Understand optimization problems: finding the shortest or most efficient route',
            'Apply graph theory basics: nodes, edges, weights, and shortest path algorithms',
            'Analyze the traveling salesman problem as a real-world logistics challenge',
            'Model delivery efficiency under constraints (time, terrain, weather)',
        ],
        'realWorld': [
            'Delivery companies (Amazon, FedEx) solve route optimization problems daily using algorithms',
            'GPS navigation apps find shortest paths using Dijkstra\'s or A* algorithms',
            'Emergency services optimize ambulance positioning to minimize response times',
        ],
        'project': {
            'title': 'Solve a Hill Town Delivery Route Problem',
            'description': 'Model a postman\'s route through hill villages as a graph and find the most efficient delivery path.',
            'steps': [
                'Create a map with 10-15 villages as nodes, connected by roads with distances and elevation changes',
                'Assign travel times based on distance and slope (uphill is slower)',
                'Implement a nearest-neighbor heuristic to find a good delivery route',
                'Try improving the route by swapping village visit order (2-opt optimization)',
                'Compare your algorithm\'s route with the simple shortest-distance path and measure improvement',
            ],
        },
    },
    'night-market-imphal': {
        'skills': [
            'Understand supply and demand curves and how prices are set in markets',
            'Analyze how seasonality, transport costs, and scarcity affect pricing',
            'Model market equilibrium and what disrupts it',
            'Calculate profit margins and break-even points for market vendors',
        ],
        'realWorld': [
            'Economists study traditional markets to understand informal economies that serve millions',
            'Supply chain managers use demand forecasting to stock perishable goods efficiently',
            'Microfinance organizations design lending products based on market vendor cash flow patterns',
        ],
        'project': {
            'title': 'Simulate a Market Economy',
            'description': 'Build a simulation of a night market where vendors set prices, customers choose based on quality and price, and market forces reach equilibrium.',
            'steps': [
                'Define 5 vendors selling similar products with different quality levels and costs',
                'Create 50 simulated customers with varying budgets and quality preferences',
                'Run a market day: each customer buys from the vendor offering the best value for them',
                'Let vendors adjust prices based on whether they sold out or had unsold stock',
                'Repeat for 10 market days and plot how prices converge toward equilibrium',
            ],
        },
    },
    'turtle-mountain': {
        'skills': [
            'Understand plate tectonics: convergent, divergent, and transform boundaries',
            'Analyze seismic wave data to understand Earth\'s internal structure',
            'Model how mountain ranges form from continental collision',
            'Calculate the rate of tectonic plate movement from GPS data',
        ],
        'realWorld': [
            'Geologists use GPS measurements to track tectonic plate movement in real time (centimeters per year)',
            'Earthquake engineers design buildings to withstand seismic forces based on plate boundary proximity',
            'Oil and gas companies use tectonic history to locate fossil fuel deposits',
        ],
        'project': {
            'title': 'Model How the Himalayas Formed',
            'description': 'Visualize the collision of the Indian and Eurasian plates over millions of years and calculate the resulting mountain uplift rate.',
            'steps': [
                'Research the timeline of India\'s northward drift: separation from Gondwana to Eurasian collision',
                'Plot India\'s position at 10-million-year intervals on a map',
                'Calculate the average plate speed from total distance and time',
                'Model mountain uplift rate and compare with measured Himalayan growth (about 5 mm/year)',
                'Discuss why the Himalayas are still growing and when they might stop',
            ],
        },
    },
    'rainbow-fish': {
        'skills': [
            'Understand thin-film interference and structural color in fish scales',
            'Analyze how refraction and reflection create iridescent effects',
            'Model light behavior at interfaces between materials of different refractive indices',
            'Compare structural color with pigment-based color in aquatic organisms',
        ],
        'realWorld': [
            'Optical engineers create anti-reflective coatings on lenses using thin-film interference principles',
            'Fashion designers use structural color fabrics that shift hue with viewing angle',
            'Security features on banknotes use thin-film interference to prevent counterfeiting',
        ],
        'project': {
            'title': 'Investigate Iridescence in Everyday Objects',
            'description': 'Find and photograph iridescent surfaces (soap bubbles, CDs, oil films) and explain the physics behind each color pattern.',
            'steps': [
                'Collect 4-5 iridescent objects: soap bubble, CD, oil on water, beetle wing (or photo), fish scale (or photo)',
                'Photograph each from multiple angles and note how colors change with viewing angle',
                'Research thin-film interference and identify the film thickness needed for each color',
                'Calculate the wavelengths that constructively interfere for a given film thickness',
                'Create a poster explaining why these objects show rainbow colors without any pigment',
            ],
        },
    },
    'holi-tea-gardens': {
        'skills': [
            'Understand the chemistry of natural and synthetic dyes: molecular structure and color',
            'Analyze pH indicators and how acidity changes dye color',
            'Model dye binding to fibers: adsorption and chemical bonding',
            'Compare permanence and safety of natural vs synthetic colorants',
        ],
        'realWorld': [
            'Textile industry chemists formulate dyes that are vibrant, fast-setting, and environmentally safe',
            'Food regulators test artificial food colors for safety and set permitted usage levels',
            'Forensic scientists analyze dye composition to trace fabric origins in criminal investigations',
        ],
        'project': {
            'title': 'Extract and Test Natural Dyes',
            'description': 'Extract dyes from plants (turmeric, beetroot, spinach) and test how they behave on different fabrics and under different pH conditions.',
            'steps': [
                'Extract color from 4 sources: turmeric, beetroot, red cabbage, and spinach by boiling in water',
                'Dip fabric strips (cotton, silk, polyester) into each dye solution and let dry',
                'Test color fastness by washing each strip and comparing before/after',
                'Add vinegar (acid) and baking soda (base) to each dye and record color changes',
                'Create a color chart showing which dye works best on which fabric and why',
            ],
        },
    },
    'kaziranga-grass': {
        'skills': [
            'Understand the role of fire in grassland ecology: nutrient cycling and seed germination',
            'Analyze grass growth rates under different flooding and burning regimes',
            'Model the competition between grassland and forest in tropical floodplains',
            'Interpret satellite imagery to track vegetation changes over years',
        ],
        'realWorld': [
            'Park managers in Kaziranga use controlled burns to maintain elephant grass habitat for rhinos',
            'Rangeland ecologists worldwide study grass-fire cycles to prevent desertification',
            'Carbon cycle scientists measure how grasslands store and release carbon during fires',
        ],
        'project': {
            'title': 'Analyze Vegetation Change in Kaziranga Using Satellite Data',
            'description': 'Use NDVI (vegetation index) data from satellite imagery to track how grassland extent in Kaziranga changes across seasons and years.',
            'steps': [
                'Research NDVI — how it measures vegetation health from satellite reflectance data',
                'Download seasonal NDVI data for Kaziranga from a free satellite data source (e.g., Google Earth Engine)',
                'Plot NDVI values across months to see the growth-burn-regrowth cycle',
                'Compare NDVI maps before and after the annual controlled burn',
                'Estimate the percentage of park area that is grassland vs forest in different years',
            ],
        },
    },
    'banyan-tree': {
        'skills': [
            'Understand aerial root systems and how banyan trees expand horizontally',
            'Analyze carbon sequestration rates for large individual trees',
            'Model how a single tree creates a micro-ecosystem supporting hundreds of species',
            'Calculate canopy area and its effect on local temperature and humidity',
        ],
        'realWorld': [
            'Urban foresters measure canopy cover to quantify cooling benefits and reduce urban heat islands',
            'Ecologists study keystone trees like banyans that support entire food webs',
            'Architects design buildings with living root bridges and green canopies inspired by banyan structure',
        ],
        'project': {
            'title': 'Measure a Tree\'s Ecosystem Services',
            'description': 'Quantify how much carbon a large tree stores, how much shade it provides, and how many species depend on it.',
            'steps': [
                'Measure or estimate a large local tree\'s trunk diameter, height, and canopy spread',
                'Calculate its biomass and carbon content using allometric equations',
                'Measure the temperature difference between under-canopy and open sun at the same time',
                'Count the number of visible species living in or on the tree (birds, insects, epiphytes, fungi)',
                'Calculate the tree\'s annual carbon sequestration and the monetary value of its ecosystem services',
            ],
        },
    },
    'basket-weaver': {
        'skills': [
            'Analyze tessellation patterns and their mathematical properties',
            'Calculate material efficiency: how much bamboo is needed for a given basket size',
            'Model the structural strength of woven vs solid materials',
            'Understand how curvature is achieved through flat weaving techniques',
        ],
        'realWorld': [
            'Composite material engineers study woven structures for lightweight, strong panels in aircraft',
            'Packaging designers use woven and corrugated structures for crush-resistant containers',
            'Digital artists use procedural weaving algorithms to generate realistic textile textures in films',
        ],
        'project': {
            'title': 'Design a Basket and Calculate Its Geometry',
            'description': 'Design a basket shape, calculate the required strip lengths and weave pattern, then build it and compare with your predictions.',
            'steps': [
                'Choose a basket shape (cylinder, bowl, or rectangular) and define its dimensions',
                'Calculate the number of strips and their lengths needed for the chosen weave pattern',
                'Estimate the total material (length of bamboo strip) required',
                'Build the basket from paper strips following your pattern plan',
                'Compare actual material used with your calculation and discuss sources of waste',
            ],
        },
    },
    'seed-keeper': {
        'skills': [
            'Understand genetic diversity and why seed banks are essential for food security',
            'Analyze seed viability testing: germination rates under controlled conditions',
            'Model how genetic diversity in crops protects against disease outbreaks',
            'Compare traditional seed saving with modern cryogenic seed banking',
        ],
        'realWorld': [
            'The Svalbard Global Seed Vault stores over 1 million seed samples as insurance against crop extinction',
            'Plant breeders access seed bank collections to develop disease-resistant crop varieties',
            'Indigenous communities maintain hundreds of traditional rice varieties through seed saving networks',
        ],
        'project': {
            'title': 'Test Seed Germination Under Different Conditions',
            'description': 'Design an experiment to test how storage conditions (temperature, moisture, light) affect seed viability over time.',
            'steps': [
                'Obtain seeds of one variety (e.g., mustard or bean) and divide into 5 equal groups of 20',
                'Store each group under different conditions: room temp dry, room temp moist, refrigerated, frozen, and sunlit',
                'After 2 weeks, plant all groups under identical conditions and count how many germinate',
                'Calculate germination rate for each storage condition',
                'Discuss which storage method best preserves seed viability and why seed banks use cold, dry storage',
            ],
        },
    },
    'cloud-namer': {
        'skills': [
            'Learn the cloud classification system: genera, species, and altitude categories',
            'Understand how temperature, humidity, and air movement create different cloud types',
            'Analyze weather patterns by reading cloud formations',
            'Apply taxonomy principles — the same classification logic used across biology and meteorology',
        ],
        'realWorld': [
            'Pilots identify cloud types to avoid turbulence and icing conditions during flight',
            'Weather forecasters use cloud classification to make short-term precipitation predictions',
            'Climate scientists track changes in cloud type distribution to assess climate change impacts',
        ],
        'project': {
            'title': 'Build a Cloud Identification Journal',
            'description': 'Photograph clouds daily for 2 weeks, classify them by type, and correlate cloud patterns with subsequent weather.',
            'steps': [
                'Learn the 10 main cloud genera and their altitude ranges (cirrus, cumulus, stratus, etc.)',
                'Photograph the sky at the same time each day for 14 days and classify the clouds',
                'Record the weather that follows within 6-12 hours (rain, clear, wind)',
                'Create a lookup table: cloud type observed vs weather that followed',
                'Test your table\'s predictive power by using it to forecast the next day\'s weather',
            ],
        },
    },
    'kingfisher-blue': {
        'skills': [
            'Understand structural color: how nanostructures produce color without pigments',
            'Analyze thin-film interference and coherent scattering at the nanoscale',
            'Compare structural color with pigment-based color in terms of physics and durability',
            'Model how feather barbule nanostructure dimensions determine reflected wavelength',
        ],
        'realWorld': [
            'Material scientists develop structural-color paints that never fade because they contain no pigments',
            'Shinkansen (bullet train) nose design was inspired by the kingfisher\'s beak to reduce noise',
            'Display technology researchers create vivid screens using structural color pixels instead of chemical dyes',
        ],
        'project': {
            'title': 'Explore Structural Color in Nature and Technology',
            'description': 'Investigate why some blues in nature (kingfisher feathers, morpho butterflies) are structural, not pigment-based, and find human-made examples.',
            'steps': [
                'Research 4-5 examples of structural color in nature (kingfisher, morpho butterfly, peacock, beetle)',
                'Explain the physical mechanism for each: thin-film interference, photonic crystal, or coherent scattering',
                'Find human-made examples of structural color: holograms, security inks, cosmetics',
                'Create a comparison table: structural color vs pigment color (durability, angle-dependence, manufacturing)',
                'Design a simple demonstration showing angle-dependent color change using a CD or soap film',
            ],
        },
    },
    'owl-wisest': {
        'skills': [
            'Understand owl adaptations for night hunting: asymmetric ears, large eyes, silent flight feathers',
            'Analyze how sound localization works with offset ear positions',
            'Model the optics of large-pupil, tube-shaped eyes for low-light vision',
            'Compare nocturnal vs diurnal predator adaptations quantitatively',
        ],
        'realWorld': [
            'Military stealth aircraft designers study owl feather edge structure for noise reduction',
            'Audio engineers use binaural (two-ear) localization principles for surround sound systems',
            'Night vision technology in cameras uses large apertures — the same principle as owl eyes',
        ],
        'project': {
            'title': 'Test Sound Localization Accuracy',
            'description': 'Run an experiment to measure how accurately humans can locate sounds with two ears, mimicking how owls triangulate prey position.',
            'steps': [
                'Blindfold a volunteer and have them point toward a sound source (clap or phone alarm)',
                'Test from 8 directions (N, NE, E, SE, S, SW, W, NW) at a fixed distance',
                'Repeat 3 times per direction and record the angle of error',
                'Test again with one ear blocked and compare accuracy',
                'Plot accuracy by direction and explain why some angles are harder (front-back confusion)',
            ],
        },
    },
    'night-jasmine': {
        'skills': [
            'Understand photoperiodism and how plants detect day length using phytochrome proteins',
            'Analyze the biochemistry of fragrance production in flowers',
            'Model circadian gene expression oscillations in plants',
            'Design experiments with controlled light and dark periods',
        ],
        'realWorld': [
            'Perfume chemists analyze night-blooming flower compounds to create fragrances',
            'Agricultural scientists manipulate photoperiod in greenhouses to control flowering time',
            'Chronobiologists study plant circadian rhythms to understand the molecular clock shared by all life',
        ],
        'project': {
            'title': 'Investigate How Light Affects Plant Behavior',
            'description': 'Test how changing light and dark periods affect when a plant opens or closes its leaves/flowers.',
            'steps': [
                'Choose a plant with visible day/night behavior (mimosa, prayer plant, or oxalis)',
                'Observe and record the normal opening/closing times for 3 days',
                'Shift the light cycle by 6 hours using a lamp and blackout cover',
                'Record how many days it takes for the plant to adjust to the new light cycle',
                'Discuss what this reveals about the plant\'s internal clock and whether it is light-driven or self-sustaining',
            ],
        },
    },
    'woodpecker-drum': {
        'skills': [
            'Understand impact biomechanics: force, impulse, and energy dissipation',
            'Analyze the multi-layered shock absorption system in woodpecker skulls',
            'Model repeated impact stress and fatigue in biological vs engineered materials',
            'Calculate the g-forces involved in pecking at 20 strikes per second',
        ],
        'realWorld': [
            'Helmet manufacturers study woodpecker cranial design for improved impact protection',
            'Hard drive engineers designed shock-resistant drives inspired by woodpecker impact absorption',
            'Sports medicine researchers apply biomechanical impact models to reduce concussion in athletes',
        ],
        'project': {
            'title': 'Design a Bio-Inspired Shock Absorber',
            'description': 'Study the woodpecker\'s shock absorption system and design a simple prototype that protects a fragile object from impact.',
            'steps': [
                'Research the 4 key shock-absorbing features: spongy bone, hyoid bone, beak-brain gap, and thick skull',
                'Design a protective housing for a raw egg using layered materials mimicking these features',
                'Drop the egg (in its housing) from increasing heights and record the maximum safe height',
                'Compare with an unprotected egg and a standard bubble-wrap protection',
                'Explain which biological feature each material layer mimics and why the design works',
            ],
        },
    },
    'music-dimasa': {
        'skills': [
            'Understand frequency and pitch as properties of sound waves',
            'Analyze rhythm patterns mathematically using time signatures and beat divisions',
            'Connect sound physics to musical instrument design',
            'Model how resonance amplifies specific frequencies in instrument bodies',
        ],
        'realWorld': [
            'Audio engineers use frequency analysis to mix and master music recordings',
            'Hearing aid designers rely on understanding sound wave properties to amplify speech frequencies',
            'Acoustic architects design concert halls using wave reflection and absorption principles',
        ],
        'project': {
            'title': 'Build a Digital Rhythm Analyzer',
            'description': 'Create a program that analyzes rhythmic patterns in traditional Dimasa music and visualizes the frequency spectrum.',
            'steps': [
                'Record or find samples of traditional Dimasa drumming',
                'Use Python to compute the frequency spectrum using FFT',
                'Identify the dominant rhythmic frequencies and their harmonic relationships',
                'Visualize the rhythm pattern as a spectrogram showing frequency vs time',
                'Compare patterns across different traditional musical styles of Northeast India',
            ],
        },
    },
    'silk-route': {
        'skills': [
            'Understand trade network theory: nodes, routes, and economic flows',
            'Analyze how geography (mountains, rivers, deserts) shapes trade corridors',
            'Model comparative advantage and why regions specialize in different goods',
            'Calculate transport costs and their effect on trade profitability',
        ],
        'realWorld': [
            'Economists model global trade networks to predict supply chain disruptions',
            'Logistics companies optimize shipping routes using the same network analysis used for historical trade routes',
            'Historians use trade route analysis to explain how technologies and cultures spread across continents',
        ],
        'project': {
            'title': 'Map and Analyze a Historical Trade Network',
            'description': 'Build a network model of the silk trade connecting Assam to global markets, analyzing how geography shaped the routes.',
            'steps': [
                'Research the major silk trade routes from Assam: overland to China, river to Bengal, and maritime',
                'Create a network graph with cities as nodes and routes as edges weighted by travel time',
                'Identify the shortest path and the most economically important nodes (trade hubs)',
                'Simulate a disruption (war, flood) blocking one route and see how trade reroutes',
                'Compare historical routes with modern transportation networks for the same goods',
            ],
        },
    },
    'girl-grew-forest': {
        'skills': [
            'Understand the process of reforestation: site preparation, species selection, and succession stages',
            'Calculate carbon sequestration rates for different tree species and ages',
            'Model forest growth using logistic curves and carrying capacity',
            'Analyze satellite imagery to measure forest cover change over decades',
        ],
        'realWorld': [
            'Carbon offset programs pay landowners to plant and maintain forests based on sequestration calculations',
            'Ecological restoration projects use succession models to plan which species to plant first',
            'Governments track deforestation and reforestation using satellite-based forest monitoring systems',
        ],
        'project': {
            'title': 'Calculate How Much Carbon a New Forest Stores',
            'description': 'Model a reforestation project: choose tree species, estimate growth rates, and calculate the total carbon captured over 30 years.',
            'steps': [
                'Select 3-4 tree species native to Assam and research their growth rates and wood density',
                'Define a 1-hectare plot and calculate how many trees can be planted at recommended spacing',
                'Model each tree\'s biomass accumulation year by year using growth curves',
                'Convert biomass to carbon stored (roughly 50% of dry biomass is carbon)',
                'Plot cumulative carbon sequestration over 30 years and compare with annual emissions of a car',
            ],
        },
    },
    'firewalker': {
        'skills': [
            'Understand heat conduction, convection, and radiation as energy transfer mechanisms',
            'Calculate thermal conductivity and the Leidenfrost effect on brief contact surfaces',
            'Model heat transfer from a hot surface to a moving foot using contact time and conductivity',
            'Analyze insulation properties of different materials',
        ],
        'realWorld': [
            'Firefighter boot designers calculate heat transfer rates to determine safe exposure times',
            'Spacecraft engineers design heat shields using thermal resistance principles for atmospheric reentry',
            'Industrial safety engineers set safe temperature limits for surfaces that workers might touch',
        ],
        'project': {
            'title': 'Investigate How Materials Conduct Heat',
            'description': 'Measure how quickly different materials transfer heat and explain why firewalking is possible on embers but not metal.',
            'steps': [
                'Gather test materials: metal spoon, wooden stick, plastic rod, ceramic tile, thick cloth',
                'Place one end of each in hot (not boiling) water and time how long until the other end feels warm',
                'Rank materials by thermal conductivity from fastest to slowest',
                'Calculate the heat transfer rate using the temperature difference and time',
                'Explain why wood embers (low conductivity) don\'t burn feet as quickly as metal at the same temperature',
            ],
        },
    },
    'frogs-sing-rain': {
        'skills': [
            'Understand how frogs produce sound using vocal sacs and laryngeal muscles',
            'Analyze the frequency, amplitude, and pattern of frog calls',
            'Model how humidity and temperature affect sound transmission in air',
            'Design audio recording protocols for field bioacoustics',
        ],
        'realWorld': [
            'Ecologists use automated audio recorders to monitor frog populations without disturbing them',
            'AI researchers train sound-classification models to identify frog species from their calls',
            'Climate scientists track frog calling dates as indicators of seasonal timing shifts',
        ],
        'project': {
            'title': 'Record and Analyze Frog Call Patterns',
            'description': 'Record amphibian calls after rain and analyze the audio to identify frequency ranges and calling patterns.',
            'steps': [
                'Record 5-10 minutes of frog chorus after a rainstorm using a phone or field recorder',
                'Load the audio into a free spectrogram tool (like Audacity) and visualize the frequency content',
                'Identify distinct call types by their frequency range and pattern (pulsed, tonal, etc.)',
                'Measure the calling rate (calls per minute) and correlate with temperature',
                'Research which local frog species match the call patterns you recorded',
            ],
        },
    },
    'eri-silk': {
        'skills': [
            'Understand the silk production process: silkworm life cycle, cocoon spinning, and fiber extraction',
            'Analyze the molecular structure of silk protein (fibroin) and its mechanical properties',
            'Compare ethical silk production (eri, ahimsa) with conventional methods',
            'Model the economics of smallholder silk production',
        ],
        'realWorld': [
            'Biomedical engineers use silk protein to create dissolvable surgical sutures and tissue scaffolds',
            'Textile manufacturers develop blended fabrics combining silk\'s strength with synthetic durability',
            'Sustainable fashion brands use eri silk as an ethical alternative to conventional silk',
        ],
        'project': {
            'title': 'Compare Silk Fiber Properties Across Types',
            'description': 'Research and compare the properties of muga, eri, mulberry, and synthetic silk to understand what makes each unique.',
            'steps': [
                'Gather fiber samples or published data for muga, eri, mulberry silk, and nylon/polyester',
                'Compare tensile strength, elasticity, moisture absorption, and luster for each fiber',
                'Create a radar chart showing the property profile of each fiber type',
                'Research the production method and ethical considerations for each',
                'Recommend which fiber is best suited for clothing, medical use, and industrial applications',
            ],
        },
    },
    'river-braid': {
        'skills': [
            'Understand how rivers deposit sediment and form braided channels',
            'Analyze the relationship between flow velocity, gradient, and sediment load',
            'Model channel formation using stream power and sediment transport equations',
            'Interpret aerial/satellite imagery of river morphology',
        ],
        'realWorld': [
            'Civil engineers study river braiding to predict where bridges and embankments will be undermined',
            'Flood forecasters model channel changes to update flood risk maps',
            'Geomorphologists use braided river patterns on Mars to infer past water flows',
        ],
        'project': {
            'title': 'Simulate River Braiding in a Sand Tray',
            'description': 'Build a physical model of a braided river using sand and flowing water, then analyze the channel patterns formed.',
            'steps': [
                'Set up a tilted tray (about 1 meter long) filled with fine sand with a water source at the top',
                'Allow water to flow gently and observe how channels form, merge, and split',
                'Photograph the channel pattern from above at 5-minute intervals',
                'Measure channel width, number of branches, and sinuosity at each time step',
                'Compare your model\'s braiding pattern with satellite images of the real Brahmaputra',
            ],
        },
    },
    'lotus-float': {
        'skills': [
            'Understand buoyancy and how plant air chambers (aerenchyma) provide flotation',
            'Analyze the lotus effect — superhydrophobic surface nanostructure',
            'Model how leaf shape and surface tension interact to keep leaves dry and afloat',
            'Calculate the buoyancy of air-filled biological structures',
        ],
        'realWorld': [
            'Material scientists create self-cleaning coatings inspired by the lotus leaf\'s nanostructure',
            'Architects designed the Beijing National Aquatics Center mimicking lotus surface water repellency',
            'Engineers use aerenchyma-like porous structures for lightweight buoyant materials',
        ],
        'project': {
            'title': 'Test the Lotus Effect on Different Surfaces',
            'description': 'Investigate superhydrophobicity by dropping water on various leaf surfaces and measuring contact angles.',
            'steps': [
                'Collect 5-6 different plant leaves (waxy, hairy, smooth, rough)',
                'Drop water on each leaf and photograph the droplet shape from the side',
                'Estimate the contact angle — higher angles mean more hydrophobic',
                'Test whether the hydrophobic leaves also self-clean by sprinkling dirt and then adding water',
                'Explain the nanostructure difference that makes some leaves hydrophobic and others wettable',
            ],
        },
    },
    'first-rice': {
        'skills': [
            'Understand crop domestication: wild ancestors, selective breeding, and genetic bottlenecks',
            'Analyze rice paddy ecology: water management, nitrogen cycling, and methane emissions',
            'Model crop yield as a function of water, nutrients, and sunlight',
            'Compare traditional farming practices with modern agricultural science',
        ],
        'realWorld': [
            'Plant geneticists develop flood-resistant rice varieties for climate-change adaptation',
            'Agricultural economists study rice markets that feed half the world\'s population',
            'Climate scientists measure methane emissions from rice paddies as a greenhouse gas source',
        ],
        'project': {
            'title': 'Grow Rice and Measure Growth Variables',
            'description': 'Germinate rice seeds under different conditions and measure how water depth, fertilizer, and light affect seedling growth.',
            'steps': [
                'Obtain rice seeds (unpolished/brown rice that can germinate) and soak overnight',
                'Set up 4 groups: normal water, deep water, fertilized water, and low light',
                'Plant seeds and measure daily growth (shoot height) for 3 weeks',
                'Plot growth curves for each group and calculate average growth rates',
                'Discuss which conditions produced the best growth and why rice is grown in standing water',
            ],
        },
    },
    'dhol-drum': {
        'skills': [
            'Understand drum physics: membrane vibration modes, overtones, and resonance',
            'Analyze how drum size, skin tension, and shell shape affect pitch and timbre',
            'Model 2D vibration patterns (Chladni patterns) on a drum surface',
            'Calculate frequency from membrane properties: tension, density, and diameter',
        ],
        'realWorld': [
            'Musical instrument companies use vibration modeling software to design drums with precise tonal qualities',
            'Audio software developers synthesize realistic drum sounds using physics-based models',
            'Structural engineers test for resonance in large membrane structures like stadium roofs',
        ],
        'project': {
            'title': 'Visualize Vibration Patterns on a Drum',
            'description': 'Demonstrate how a drum membrane vibrates in complex patterns and how changing tension changes the sound.',
            'steps': [
                'Stretch a balloon or plastic wrap tightly over a bowl to create a simple drum',
                'Sprinkle fine salt or sand on the surface and tap the edge to see vibration patterns',
                'Play different frequencies near the drum using a tone generator app and observe how patterns change',
                'Photograph the patterns and match them to theoretical Chladni pattern diagrams',
                'Vary the membrane tension and record how it changes both the patterns and the pitch of the drum',
            ],
        },
    },
    'little-chef': {
        'skills': [
            'Understand the chemistry of cooking: denaturation, emulsification, caramelization, and fermentation',
            'Analyze how temperature affects reaction rates in food preparation',
            'Model pH changes during fermentation and their effect on flavor',
            'Calculate nutritional content using food composition data',
        ],
        'realWorld': [
            'Food scientists develop new products by controlling chemical reactions during processing',
            'Restaurant chefs use sous-vide cooking to precisely control denaturation temperatures',
            'Nutritionists use food chemistry knowledge to design balanced meal plans',
        ],
        'project': {
            'title': 'Investigate the Chemistry of Cooking',
            'description': 'Test how cooking methods (boiling, frying, fermenting) chemically transform the same ingredient and affect its properties.',
            'steps': [
                'Choose one ingredient (potato, egg, or milk) and prepare it 4 ways: raw, boiled, fried, and fermented',
                'Observe and record changes in color, texture, smell, and taste for each preparation',
                'Research the chemical reaction responsible for each change (e.g., Maillard for browning)',
                'Measure the pH of fermented samples vs fresh samples using pH strips',
                'Create a summary poster linking each cooking method to the underlying chemistry',
            ],
        },
    },
    'flying-squirrel': {
        'skills': [
            'Understand gliding aerodynamics: lift, drag, glide ratio, and patagium mechanics',
            'Analyze the physics of controlled descent vs powered flight',
            'Model glide trajectories given launch height, body mass, and wing loading',
            'Compare gliding adaptations across species: flying squirrels, colugos, flying fish',
        ],
        'realWorld': [
            'Wingsuit designers use the same aerodynamic principles as flying squirrel patagia',
            'Military paraglider systems calculate glide ratios for precision supply drops',
            'Drone engineers study animal gliding for energy-efficient unpowered descent modes',
        ],
        'project': {
            'title': 'Test Paper Glider Designs for Maximum Distance',
            'description': 'Build paper gliders with different wing shapes and sizes, measure their glide ratio, and find the optimal design.',
            'steps': [
                'Build 4 paper gliders with different wing area and aspect ratio (wide vs narrow wings)',
                'Launch each from the same height and measure horizontal distance traveled',
                'Calculate the glide ratio (horizontal distance / height) for each design',
                'Adjust weight distribution (add paper clips to nose or tail) and test again',
                'Identify the design with the best glide ratio and explain why, linking to flying squirrel anatomy',
            ],
        },
    },
    'fireflies-dont-burn': {
        'skills': [
            'Understand bioluminescence: the luciferin-luciferase chemical reaction',
            'Analyze energy efficiency: percentage of energy converted to light vs heat',
            'Compare bioluminescence with incandescence and fluorescence',
            'Model the quantum yield of bioluminescent reactions',
        ],
        'realWorld': [
            'Medical researchers use luciferase as a reporter gene to track cell activity in real time',
            'Marine biologists study deep-sea bioluminescence to understand ocean ecosystem dynamics',
            'Biotech companies develop bioluminescent markers for water quality testing',
        ],
        'project': {
            'title': 'Compare Light Source Efficiency and Heat Output',
            'description': 'Measure how much heat different light sources produce relative to their brightness, and understand why firefly light is "cold."',
            'steps': [
                'Gather light sources: candle, incandescent bulb, LED, and glow stick (chemiluminescent)',
                'Measure brightness using a phone light meter app at a fixed distance',
                'Measure temperature near each source using a thermometer (same distance)',
                'Calculate the heat-to-light ratio for each source',
                'Research firefly efficiency (nearly 100% light) and compare with your measured sources',
            ],
        },
    },
    'seed-travel': {
        'skills': [
            'Understand seed dispersal mechanisms: wind, water, animal, and ballistic',
            'Analyze how seed shape relates to dispersal strategy (wings, hooks, flotation, explosive pods)',
            'Model wind dispersal distance as a function of seed mass and wing area',
            'Design experiments to test dispersal distance under different conditions',
        ],
        'realWorld': [
            'Agricultural weed scientists study seed dispersal to predict and control invasive species spread',
            'Forestry managers plan reforestation by understanding natural seed rain patterns',
            'Engineers design micro-drones inspired by maple seed autorotation for passive aerial delivery',
        ],
        'project': {
            'title': 'Test Seed Dispersal Distances by Mechanism',
            'description': 'Collect seeds with different dispersal strategies and measure how far each travels under controlled conditions.',
            'steps': [
                'Collect or create models of 4 seed types: winged (maple), fluffy (dandelion), hooked (burdock), and heavy (coconut)',
                'Drop winged and fluffy seeds from a fixed height with a fan simulating wind and measure distance',
                'Test hooked seeds by attaching to fabric and measuring how far they travel on a moving surface',
                'Float buoyant seeds in a water channel and measure travel distance',
                'Create a comparison chart linking seed design to dispersal distance and strategy',
            ],
        },
    },
    'siang-river': {
        'skills': [
            'Understand fluvial erosion: hydraulic action, abrasion, attrition, and solution',
            'Calculate stream power from flow velocity, depth, and gradient',
            'Model V-shaped valley formation and canyon deepening over geological time',
            'Analyze how rock type affects erosion rate and valley shape',
        ],
        'realWorld': [
            'Dam engineers assess river erosion rates to predict reservoir sedimentation lifetimes',
            'Geologists study river canyon formation to reconstruct tectonic uplift history',
            'Environmental engineers design riverbank stabilization using erosion rate data',
        ],
        'project': {
            'title': 'Simulate River Erosion in a Stream Table',
            'description': 'Build a simple stream table to observe how water flow rate and slope affect erosion and channel formation.',
            'steps': [
                'Set up a tilted tray with layers of sand, clay, and gravel representing different rock types',
                'Run water at a low flow rate and observe erosion patterns for 10 minutes',
                'Increase flow rate and observe how erosion speed and channel width change',
                'Increase the tilt angle and observe how gradient affects downcutting vs lateral erosion',
                'Photograph the final channel and compare its shape with satellite images of the Siang River gorge',
            ],
        },
    },
    'takin-face': {
        'skills': [
            'Understand how genes control facial morphology and body proportions',
            'Analyze the role of genetic drift and natural selection in shaping unusual traits',
            'Model how multiple genes interact to produce complex phenotypes',
            'Compare facial structure across related species to trace evolutionary divergence',
        ],
        'realWorld': [
            'Forensic scientists use facial morphology genetics to predict appearance from DNA',
            'Veterinary geneticists identify breed-related health risks from physical trait associations',
            'Evolutionary biologists study unusual morphologies to understand adaptation to extreme environments',
        ],
        'project': {
            'title': 'Map Facial Feature Variation Across Related Species',
            'description': 'Compare skull and face proportions across bovid species (takin, goat, muskox, cow) to understand how evolution shaped each face.',
            'steps': [
                'Find or draw front-view skull diagrams of 5 related bovid species',
                'Measure and record proportional ratios: nose width/skull width, eye spacing/skull width, horn angle',
                'Create a scatter plot of these ratios to visualize how species cluster',
                'Research the habitat and lifestyle of each species and look for correlations with facial structure',
                'Propose evolutionary explanations for the takin\'s unique flat face based on its alpine habitat',
            ],
        },
    },
    'talking-parrot-hajo': {
        'skills': [
            'Understand the neuroscience of vocal learning in parrots: brain regions and mirror neurons',
            'Analyze the difference between mimicry and language comprehension',
            'Model speech recognition systems and how they process audio input',
            'Compare animal communication systems across species',
        ],
        'realWorld': [
            'AI speech recognition systems (Siri, Alexa) process language using neural network models inspired by biological hearing',
            'Speech therapists study how parrots and humans share vocal learning brain circuits',
            'Linguists use animal communication studies to understand the origins of human language',
        ],
        'project': {
            'title': 'Build a Simple Word Recognition Program',
            'description': 'Create a Python program that records short audio clips and classifies them into categories, mimicking how a parrot learns to associate sounds with meanings.',
            'steps': [
                'Research how parrot brains process and reproduce sounds (vocal learning pathway)',
                'Record 10 instances each of 3 simple words spoken by different people',
                'Extract audio features (pitch, duration, spectral shape) from each recording',
                'Train a simple classifier (k-nearest neighbors) to identify which word is being spoken',
                'Test the classifier with new recordings and report its accuracy',
            ],
        },
    },
    'secret-garden-loktak': {
        'skills': [
            'Understand floating wetland ecosystems: phumdi formation and nutrient cycling',
            'Analyze aquatic plant adaptations: aerenchyma, floating roots, and gas exchange',
            'Model the water quality filtering effect of wetland vegetation',
            'Calculate biomass productivity of aquatic vs terrestrial plants',
        ],
        'realWorld': [
            'Environmental engineers design constructed wetlands to treat wastewater naturally',
            'Conservation biologists manage Loktak Lake, the world\'s only floating national park',
            'Climate scientists study wetland methane and carbon fluxes for greenhouse gas budgets',
        ],
        'project': {
            'title': 'Build a Mini Floating Garden',
            'description': 'Construct a small floating garden to test which aquatic plants grow best and how they filter water.',
            'steps': [
                'Build a small floating platform from recycled materials (styrofoam, plastic bottles)',
                'Plant 3-4 aquatic or semi-aquatic plants (water hyacinth, mint, lettuce) in the platform',
                'Float the garden in a tub of nutrient-rich water (add a small amount of fertilizer)',
                'Measure water clarity and plant growth weekly for 3-4 weeks',
                'Compare water quality in the planted tub vs an unplanted control tub',
            ],
        },
    },
    'stars-ziro-valley': {
        'skills': [
            'Understand light pollution: sky glow, glare, and their effect on astronomical observation',
            'Analyze the inverse square law for light intensity falloff',
            'Model the Bortle scale for sky darkness classification',
            'Calculate limiting stellar magnitude visible under different light conditions',
        ],
        'realWorld': [
            'Astronomers advocate for dark sky reserves to preserve research-quality observation sites',
            'Ecologists study how light pollution disrupts nocturnal animal behavior and migration',
            'Lighting engineers design downward-facing fixtures to reduce sky glow in cities',
        ],
        'project': {
            'title': 'Measure Light Pollution in Your Area',
            'description': 'Quantify sky brightness at multiple locations using star counts and a phone-based sky quality meter.',
            'steps': [
                'Learn to identify 3-4 constellations and their component stars with known magnitudes',
                'On a clear night, count visible stars in a specific constellation from 3 locations (urban, suburban, rural)',
                'Use a phone app (like "Loss of the Night") to measure sky brightness in magnitudes per square arcsecond',
                'Plot your measurements on the Bortle scale and compare locations',
                'Propose 3 practical steps your community could take to reduce light pollution',
            ],
        },
    },
    'mishing-fish': {
        'skills': [
            'Understand fish behavior: schooling, feeding patterns, and habitat preference',
            'Analyze how traditional fishing methods exploit fish biology',
            'Model sustainable catch rates using simple population dynamics',
            'Compare traditional and modern fishing technology for efficiency and environmental impact',
        ],
        'realWorld': [
            'Fisheries scientists set catch quotas using population dynamics models to prevent overfishing',
            'Traditional ecological knowledge is increasingly integrated into modern conservation planning',
            'Aquaculture engineers design fish farm systems based on species-specific behavioral needs',
        ],
        'project': {
            'title': 'Model a Fish Population Under Different Harvesting Rates',
            'description': 'Simulate a fish population growing and being harvested, and find the maximum sustainable yield.',
            'steps': [
                'Start with a population of 1000 fish and a growth rate (e.g., 20% per year)',
                'Simulate year-by-year population growth using the logistic growth model with a carrying capacity',
                'Apply different harvesting rates (10%, 20%, 30%, 40%) and track population over 50 years',
                'Plot population over time for each harvesting rate',
                'Identify the maximum sustainable yield — the highest harvest that doesn\'t crash the population',
            ],
        },
    },
    'coconut-jackfruit': {
        'skills': [
            'Understand DNA and how genetic information determines species identity',
            'Analyze phenotype vs genotype: why some organisms look similar but are genetically different',
            'Model simple inheritance patterns and genetic variation within a species',
            'Compare plant classification systems: morphological vs genetic',
        ],
        'realWorld': [
            'Agricultural scientists use genetic testing to verify seed purity and prevent mislabeling',
            'Forensic botanists identify plant material from crime scenes using DNA analysis',
            'Conservation geneticists assess biodiversity by sequencing environmental DNA from soil and water',
        ],
        'project': {
            'title': 'Extract DNA from Fruit and Observe It',
            'description': 'Perform a simple DNA extraction from a banana (or other fruit) using household materials and see the actual strands.',
            'steps': [
                'Mash a piece of banana in a zip-lock bag with warm salty water and dish soap',
                'Filter the mixture through a coffee filter into a glass',
                'Slowly pour cold isopropyl alcohol down the side of the glass to form a layer on top',
                'Watch as white, stringy DNA precipitates at the alcohol-liquid boundary',
                'Explain each step: soap breaks cell membranes, salt clumps DNA, alcohol precipitates it from solution',
            ],
        },
    },
    'paper-umbrella': {
        'skills': [
            'Understand waterproofing chemistry: hydrophobic coatings and surface tension',
            'Analyze the structural engineering of an umbrella: ribs, canopy tension, and load distribution',
            'Model how paper strength changes with moisture content',
            'Calculate the force exerted by rain on an umbrella canopy',
        ],
        'realWorld': [
            'Waterproof fabric engineers design Gore-Tex and other membranes that breathe but repel water',
            'Structural engineers study umbrella-like tensile structures for stadium roofs and canopies',
            'Paper scientists develop water-resistant packaging using biodegradable coatings',
        ],
        'project': {
            'title': 'Test Waterproofing Methods on Paper',
            'description': 'Compare different waterproofing treatments (oil, wax, plastic film) on paper to find the most effective and sustainable method.',
            'steps': [
                'Cut 6 identical paper squares and leave one untreated as a control',
                'Apply different treatments: vegetable oil, candle wax, beeswax, coconut oil, and plastic wrap',
                'Drop 10 ml of water on each and time how long before the paper soaks through',
                'Weigh each paper before and after the water test to measure absorption',
                'Rank treatments by effectiveness and discuss trade-offs between sustainability and performance',
            ],
        },
    },
    'witch-doctor': {
        'skills': [
            'Understand how active compounds in plants produce medicinal effects',
            'Analyze the process from traditional remedy to pharmaceutical drug',
            'Model dose-response curves and the concept of therapeutic windows',
            'Compare traditional knowledge-based and laboratory-based drug discovery',
        ],
        'realWorld': [
            'About 25% of modern pharmaceuticals are derived from plant compounds discovered through traditional medicine',
            'Ethnobotanists document indigenous plant knowledge before it is lost',
            'Pharmaceutical companies screen rainforest plant extracts for new antibiotic compounds',
        ],
        'project': {
            'title': 'Research Plants That Became Medicines',
            'description': 'Trace the journey from traditional plant remedy to modern medicine for 5 well-known drugs.',
            'steps': [
                'Research 5 drugs originally derived from plants: aspirin (willow), quinine (cinchona), morphine (poppy), taxol (yew), artemisinin (wormwood)',
                'For each, document the traditional use, the active compound, and how it was scientifically validated',
                'Create a timeline showing when each was used traditionally vs when the compound was isolated',
                'Test a safe herbal remedy (e.g., chamomile tea vs warm water) on self-rated relaxation — is there a measurable effect?',
                'Discuss the ethics of using indigenous knowledge in pharmaceutical development',
            ],
        },
    },
    'turtle-slow': {
        'skills': [
            'Understand evolutionary trade-offs: speed vs armor, metabolism vs longevity',
            'Analyze the biomechanics of turtle locomotion on land vs in water',
            'Model natural selection pressure on body plan traits over generations',
            'Compare metabolic rates across reptile species and link to lifespan',
        ],
        'realWorld': [
            'Roboticists design tank-like robots with turtle-inspired shell protection for harsh environments',
            'Gerontologists study long-lived turtles to understand the genetics of aging and longevity',
            'Conservation biologists use nesting site data and growth models to manage endangered sea turtle populations',
        ],
        'project': {
            'title': 'Model the Speed-vs-Armor Trade-Off in Evolution',
            'description': 'Simulate a population of creatures evolving under predation pressure, where individuals must trade off between speed and shell thickness.',
            'steps': [
                'Define a population of 100 individuals with random speed and armor values (inversely related by a budget)',
                'Simulate predator attacks where faster individuals escape more often, but armored ones survive hits',
                'Let survivors reproduce with slight random mutation in speed/armor allocation',
                'Run the simulation for 100 generations under different predator types (fast vs strong)',
                'Plot how the population\'s average speed and armor shift depending on predator strategy',
            ],
        },
    },
    'market-day-tura': {
        'skills': [
            'Understand supply and demand fundamentals and market price determination',
            'Analyze the concept of comparative advantage in local trade',
            'Calculate profit, loss, and break-even points for small businesses',
            'Model how information asymmetry affects buyer and seller decisions',
        ],
        'realWorld': [
            'Microfinance organizations help market vendors manage cash flow and grow their businesses',
            'Agricultural market information systems use mobile phones to give farmers real-time price data',
            'Economists study informal markets in developing countries to design better trade policies',
        ],
        'project': {
            'title': 'Track Prices and Build a Market Dashboard',
            'description': 'Collect prices for common goods at a local market over 2 weeks and analyze what causes price changes.',
            'steps': [
                'Choose 5-6 common goods (rice, tomatoes, onions, eggs, fish, cooking oil) and record prices daily',
                'Create a spreadsheet and plot price over time for each item',
                'Identify which items have stable vs volatile prices',
                'Research what causes the price changes (weather, transport disruption, seasonal supply)',
                'Build a simple dashboard chart showing all items and highlight significant price movements',
            ],
        },
    },
    'elephant-corridor': {
        'skills': [
            'Understand habitat fragmentation and its impact on wildlife movement and genetic diversity',
            'Analyze landscape connectivity using GIS corridor modeling',
            'Model minimum viable population size and gene flow requirements',
            'Interpret satellite imagery to map land use change over decades',
        ],
        'realWorld': [
            'Conservation agencies design wildlife corridors to reconnect fragmented elephant ranges across India',
            'Highway planners build underpasses and overpasses for wildlife crossing based on movement data',
            'Insurance companies and forestry departments use elephant movement data to reduce human-wildlife conflict',
        ],
        'project': {
            'title': 'Design a Wildlife Corridor Using Map Data',
            'description': 'Analyze a landscape map to identify the optimal path for a wildlife corridor connecting two forest patches.',
            'steps': [
                'Create or obtain a simple land-use grid map showing forest, farmland, road, river, and village areas',
                'Assign a movement cost to each land type (forest = easy, road = hard, village = blocked)',
                'Implement a least-cost path algorithm to find the easiest route between two forest patches',
                'Visualize the optimal corridor on the map',
                'Propose practical measures (tree planting, road underpasses) to make the corridor functional',
            ],
        },
    },
    'golden-hilsa': {
        'skills': [
            'Understand fish population dynamics: birth rates, death rates, and carrying capacity',
            'Analyze the economics of fishing: effort, catch, and revenue curves',
            'Model the tragedy of the commons and how shared resources get overexploited',
            'Calculate maximum sustainable yield from biological parameters',
        ],
        'realWorld': [
            'International fishing commissions set quotas based on stock assessment models to prevent collapse',
            'Coastal communities implement traditional fishing bans (closed seasons) backed by scientific data',
            'Seafood certification programs (like MSC) verify that fish products come from sustainable fisheries',
        ],
        'project': {
            'title': 'Simulate the Tragedy of the Commons',
            'description': 'Build a game where multiple fishers share a lake, and demonstrate how individual incentives lead to collective overfishing.',
            'steps': [
                'Set up a shared "lake" with 100 fish that grow by 20% each round (capped at 100)',
                'Create 4 "fishers" who each decide how many fish to catch per round',
                'Run round-by-round: subtract catches, apply growth, and repeat for 20 rounds',
                'Test greedy strategy (catch maximum) vs conservative strategy (catch 10% of stock)',
                'Show how the lake collapses under greedy fishing but sustains under cooperative management',
            ],
        },
    },
    'cloud-refused-rain': {
        'skills': [
            'Understand cloud formation: condensation nuclei, saturation, and droplet growth',
            'Analyze cloud seeding chemistry: silver iodide, dry ice, and hygroscopic salts',
            'Model the conditions required for precipitation: droplet coalescence and ice crystal growth',
            'Evaluate the evidence for and against the effectiveness of cloud seeding',
        ],
        'realWorld': [
            'Countries like China and UAE invest in cloud seeding programs to increase rainfall over dry regions',
            'Atmospheric scientists debate cloud seeding effectiveness using randomized controlled experiments',
            'Agricultural regions facing drought explore weather modification as a last resort for crop survival',
        ],
        'project': {
            'title': 'Investigate the Conditions for Condensation',
            'description': 'Test how temperature, humidity, and nucleation particles affect when and where water vapor condenses.',
            'steps': [
                'Create a cloud in a jar: add warm water, place ice on top, and introduce smoke (condensation nuclei)',
                'Test with and without smoke to demonstrate the role of condensation nuclei',
                'Vary the temperature difference (warm water temp vs ice) and rate cloud formation speed',
                'Research how silver iodide acts as artificial condensation nuclei in cloud seeding',
                'Discuss the ethical questions: who decides when and where to seed clouds, and who bears the consequences?',
            ],
        },
    },
    'friendship-bridge': {
        'skills': [
            'Understand bridge engineering principles: tension, compression, load distribution, and span',
            'Analyze different bridge types: beam, arch, suspension, and truss',
            'Model how material choice affects bridge strength-to-weight ratio',
            'Calculate maximum load capacity from structural dimensions and material properties',
        ],
        'realWorld': [
            'Civil engineers design bridges to withstand live loads (traffic), dead loads (self-weight), and environmental forces (wind, earthquakes)',
            'Ancient root bridges of Meghalaya demonstrate living architecture that strengthens over decades',
            'Modern bridge monitoring systems use strain sensors to detect structural problems before failure',
        ],
        'project': {
            'title': 'Build and Test Bridge Designs for Maximum Load',
            'description': 'Construct bridges from popsicle sticks or straws and test which design supports the most weight relative to its own mass.',
            'steps': [
                'Build 3 bridge types using identical materials: beam bridge, arch bridge, and truss bridge',
                'Ensure all bridges span the same gap (30 cm) between two supports',
                'Add weight to the center of each bridge incrementally until failure',
                'Record the maximum load and calculate the load-to-weight ratio for each design',
                'Explain which forces (tension, compression) dominate in each design and why the winner won',
            ],
        },
    },
    'mountain-echoes': {
        'skills': [
            'Understand sound reflection, absorption, and the conditions for hearing an echo',
            'Calculate echo return time from distance and speed of sound',
            'Analyze how surface material and shape affect sound reflection quality',
            'Model reverberation time in enclosed and open spaces',
        ],
        'realWorld': [
            'Sonar and radar systems use echo timing to measure distance — the same principle as mountain echoes',
            'Concert hall architects design wall shapes and materials to control reverberation for optimal sound',
            'Geologists use seismic echoes (reflected sound waves) to map underground rock layers and find oil deposits',
        ],
        'project': {
            'title': 'Measure the Speed of Sound Using Echoes',
            'description': 'Use a large wall or building and a stopwatch to measure echo return time and calculate the speed of sound.',
            'steps': [
                'Find a large flat wall with open space in front (at least 50 meters of clear distance)',
                'Stand at a measured distance from the wall and clap sharply, timing the echo return',
                'Repeat 10 times and calculate the average echo time',
                'Calculate speed of sound: distance = 2 x distance-to-wall, speed = distance / time',
                'Compare your measurement with the accepted value (343 m/s at 20C) and discuss sources of error',
            ],
        },
    },
    'dancer-floating-market': {
        'skills': [
            'Understand market economics: pricing strategies, marginal costs, and consumer behavior',
            'Analyze how unique selling points (location, experience, tradition) create economic value',
            'Model tourism economics: visitor spending multiplier effects',
            'Calculate cost-benefit analysis for traditional vs modern market formats',
        ],
        'realWorld': [
            'Tourism economists study how cultural markets attract visitors and generate income for local communities',
            'Urban planners revitalize traditional markets as both economic hubs and cultural preservation sites',
            'Floating markets in Thailand, Vietnam, and India serve as case studies in adaptive commerce',
        ],
        'project': {
            'title': 'Analyze the Economics of a Local Market',
            'description': 'Study a nearby market and calculate vendor economics: costs, pricing, foot traffic, and how location affects revenue.',
            'steps': [
                'Visit a local market and count the number of vendors and estimate daily customer traffic',
                'Interview 2-3 willing vendors about their costs (rent, stock, transport) and daily revenue',
                'Calculate average profit margin and daily income for each vendor type',
                'Estimate the total economic value the market generates for the community',
                'Propose one improvement (better location, online presence, tourist signage) and estimate its economic impact',
            ],
        },
    },
    'ferrymans-riddle': {
        'skills': [
            'Understand fluid dynamics: pressure, flow velocity, and Bernoulli\'s principle',
            'Analyze how hull shape and propulsion method affect boat speed and fuel efficiency',
            'Model river current effects on ferry crossing angle and time',
            'Calculate the optimal crossing angle to minimize travel time in a current',
        ],
        'realWorld': [
            'Naval engineers optimize ferry hull designs using computational fluid dynamics (CFD) simulations',
            'River transport authorities calculate safe crossing strategies accounting for seasonal current changes',
            'Hydraulic engineers model river flow to design efficient water intake and drainage systems',
        ],
        'project': {
            'title': 'Solve the River Crossing Problem',
            'description': 'Calculate the optimal angle for a ferry to cross a river with a current, minimizing travel time or distance downstream.',
            'steps': [
                'Set up the problem: a ferry crosses a 200m wide river flowing at 3 m/s, ferry speed 5 m/s',
                'Calculate crossing time and downstream drift if the ferry points straight across',
                'Use vector addition to find the angle that results in a straight-across crossing',
                'Calculate the angle that minimizes total crossing time (not necessarily straight across)',
                'Plot crossing paths for 5 different angles and identify the best strategy',
            ],
        },
    },
    'wild-orchids-trees': {
        'skills': [
            'Understand epiphytic relationships: how orchids grow on trees without parasitizing them',
            'Analyze the difference between parasitism, mutualism, and commensalism',
            'Model nutrient acquisition strategies in epiphytes: aerial roots, mycorrhizal fungi',
            'Calculate the microclimate advantages of canopy-level living vs forest floor',
        ],
        'realWorld': [
            'Orchid conservationists propagate endangered species using mycorrhizal fungi partnerships',
            'Epiphyte monitoring is used as an indicator of air quality and forest health',
            'Green wall and rooftop garden designers apply epiphyte biology to urban vertical gardens',
        ],
        'project': {
            'title': 'Survey Epiphytes in Your Local Area',
            'description': 'Map and identify plants growing on other plants (mosses, ferns, orchids, lichens) and analyze their distribution patterns.',
            'steps': [
                'Choose 5-10 trees in a park or garden and examine each for epiphytes',
                'Record the type, location (trunk height, branch position), and size of each epiphyte',
                'Note the host tree species, bark texture, and canopy density for each observation',
                'Analyze patterns: do epiphytes prefer rough bark, north-facing branches, or certain tree species?',
                'Create a diagram showing the typical vertical distribution of epiphytes on a tree',
            ],
        },
    },
    'guwahati-name': {
        'skills': [
            'Understand how place names (toponymy) encode geographic, historical, and linguistic information',
            'Analyze the etymology of local place names using historical language records',
            'Model how cities grow and their geographic constraints (rivers, hills) shape urban form',
            'Compare historical and modern maps to track urban expansion',
        ],
        'realWorld': [
            'Urban geographers study city names and layout to reconstruct historical settlement patterns',
            'City planners use geographic analysis to decide where to locate infrastructure and services',
            'Linguists map place name origins to trace migration routes and language evolution',
        ],
        'project': {
            'title': 'Map the Etymology of Local Place Names',
            'description': 'Research the origins of 15-20 place names in your region and create an annotated map showing their linguistic and geographic roots.',
            'steps': [
                'List 15-20 local place names (towns, rivers, hills, neighborhoods)',
                'Research the etymology of each: what language is it from, what does it mean?',
                'Categorize names by type: geographic feature (river, hill), historical event, person, or language of origin',
                'Plot the names on a map and color-code by category or language origin',
                'Identify patterns: do names from the same language cluster in the same geographic area?',
            ],
        },
    },
    'story-garden': {
        'skills': [
            'Understand narrative structure: setup, conflict, climax, and resolution',
            'Analyze how stories encode and transmit knowledge across generations',
            'Model story branching and interactive narrative design',
            'Compare oral tradition with written and digital storytelling as information systems',
        ],
        'realWorld': [
            'Game designers use branching narrative structures to create interactive story-driven experiences',
            'Data journalists use storytelling frameworks to make complex data understandable and engaging',
            'Educational researchers study narrative learning — how stories improve knowledge retention by 30-65%',
        ],
        'project': {
            'title': 'Build an Interactive Story Engine',
            'description': 'Create a simple program that tells a branching story where reader choices lead to different outcomes.',
            'steps': [
                'Map out a story with a beginning and 3 decision points, each leading to 2 possible paths',
                'Draw the story structure as a tree diagram (like a flowchart)',
                'Implement the story in Python using dictionaries to store scenes and choices',
                'Add a scoring system that tracks the reader\'s choices and gives a different ending based on their path',
                'Test with 3 people and see which paths they choose most often',
            ],
        },
    },
    # Stories from the first batch that also need filling (girl-who-spoke-to-elephants and friends)
    'girl-who-spoke-to-elephants': {
        'skills': [
            'Understand infrasound communication in elephants and how animals use low-frequency signals',
            'Analyze audio spectrograms to identify animal vocalizations',
            'Model how machine learning classifies sounds into categories',
            'Design data collection protocols for wildlife acoustic monitoring',
        ],
        'realWorld': [
            'Wildlife researchers deploy acoustic sensors to monitor elephant herds and detect poachers',
            'AI-powered sound classifiers automatically identify species from audio recordings in biodiversity surveys',
            'Zoos use acoustic monitoring to assess elephant emotional states and social dynamics',
        ],
        'project': {
            'title': 'Build an Animal Sound Classifier',
            'description': 'Train a simple machine learning model to distinguish between different animal sounds using audio features.',
            'steps': [
                'Download audio samples of 4-5 animal species from a sound library (e.g., Xeno-canto, Macaulay Library)',
                'Extract features from each audio clip: dominant frequency, duration, amplitude envelope',
                'Visualize the features as spectrograms and note differences between species',
                'Train a k-nearest neighbors classifier on the extracted features',
                'Test the classifier with new audio samples and report its accuracy',
            ],
        },
    },
    'firefly-festival-of-majuli': {
        'skills': [
            'Understand LED circuit design: series vs parallel, resistor selection, and Ohm\'s law',
            'Analyze bioluminescence chemistry: the luciferin-luciferase reaction',
            'Model synchronization phenomena in biological and electronic systems',
            'Program microcontrollers to create timed light patterns',
        ],
        'realWorld': [
            'LED lighting designers create energy-efficient displays using the same circuit principles',
            'Researchers study firefly synchronization to improve distributed computing algorithms',
            'Biomedical engineers use bioluminescent markers for live-cell imaging in cancer research',
        ],
        'project': {
            'title': 'Build a Synchronized LED Firefly Display',
            'description': 'Create a set of LEDs that blink independently, then gradually synchronize — mimicking the firefly synchronization phenomenon.',
            'steps': [
                'Build a basic LED circuit with a resistor and power source',
                'Program a microcontroller (Arduino) to blink one LED at a set interval',
                'Add 4-5 more LEDs, each starting with a slightly different blink timing',
                'Implement a synchronization algorithm: each LED adjusts its timing based on neighbors',
                'Observe and record how many cycles it takes for all LEDs to synchronize',
            ],
        },
    },
    'river-dolphins-secret': {
        'skills': [
            'Understand echolocation: how dolphins emit sound pulses and interpret echoes',
            'Analyze the physics of sonar: frequency, pulse rate, and target detection',
            'Model how ultrasonic sensors measure distance using time-of-flight calculations',
            'Compare biological sonar with human-engineered sonar and radar systems',
        ],
        'realWorld': [
            'Submarine sonar systems use the same echo-timing principle as dolphin echolocation',
            'Medical ultrasound imaging creates pictures of internal organs using reflected sound waves',
            'Autonomous vehicles use ultrasonic sensors for parking assistance and obstacle detection',
        ],
        'project': {
            'title': 'Build an Ultrasonic Distance Sensor',
            'description': 'Wire up an ultrasonic sensor with an Arduino to measure distances, replicating the principle dolphins use to navigate murky rivers.',
            'steps': [
                'Connect an HC-SR04 ultrasonic sensor to an Arduino board',
                'Write code to send a pulse and measure the echo return time',
                'Convert the time-of-flight to distance using the speed of sound',
                'Test accuracy by measuring known distances and comparing with a ruler',
                'Add an LED or buzzer that alerts when an object is closer than a threshold distance',
            ],
        },
    },
    'boy-who-built-a-library': {
        'skills': [
            'Understand database design: tables, keys, relationships, and queries',
            'Analyze how websites serve content using HTML, CSS, and server-side logic',
            'Model information architecture: categorization, search, and retrieval',
            'Compare relational databases with document stores for different use cases',
        ],
        'realWorld': [
            'Library management systems organize millions of books using databases with catalog and patron records',
            'E-commerce platforms like Amazon use sophisticated database systems to manage inventory and recommendations',
            'Wikipedia serves billions of pages from a structured database with version history for every edit',
        ],
        'project': {
            'title': 'Build a Digital Library Catalog',
            'description': 'Design and build a simple web-based library catalog where users can add, search, and borrow books.',
            'steps': [
                'Design a database schema with tables for books (title, author, genre, ISBN) and borrowers',
                'Create an HTML form for adding new books to the catalog',
                'Build a search page that filters books by title, author, or genre',
                'Add a borrow/return system that tracks which books are checked out',
                'Style the interface with CSS and test with 20-30 sample book entries',
            ],
        },
    },
    'dragonfly-and-the-paddy-field': {
        'skills': [
            'Understand computer vision: how cameras capture and computers process images',
            'Analyze the physics of dragonfly flight: four-wing aerodynamics and hovering',
            'Model object detection using bounding boxes and classification confidence scores',
            'Compare drone capabilities with biological flight performance',
        ],
        'realWorld': [
            'Agricultural drones survey crop fields using cameras and multispectral sensors to detect disease and pest damage',
            'Military and search-and-rescue teams use drone-mounted computer vision for surveillance and detection',
            'Dragonfly-inspired micro air vehicles are under development for confined-space inspection',
        ],
        'project': {
            'title': 'Detect Objects in Aerial Images',
            'description': 'Use a pre-trained computer vision model to identify and count objects (plants, animals, structures) in aerial photographs.',
            'steps': [
                'Download or photograph aerial images of a field, garden, or park',
                'Load a pre-trained object detection model (YOLO or MobileNet) in Python',
                'Run the model on your images and examine the detected objects and confidence scores',
                'Filter detections by confidence threshold and count objects by category',
                'Discuss the limitations: what does the model miss, and what does it misidentify?',
            ],
        },
    },
    'why-the-muga-silk-is-golden': {
        'skills': [
            'Understand silk fiber biology: how silkworms spin protein fibers',
            'Analyze what gives muga silk its unique golden color at the molecular level',
            'Model the tensile strength of silk compared with synthetic fibers and steel',
            'Compare the economics of different silk types: mulberry, muga, eri, and tasar',
        ],
        'realWorld': [
            'Material scientists study spider and silkworm silk for bio-inspired super-strong fibers',
            'The Assam silk industry produces muga silk exclusively — it cannot be cultivated elsewhere',
            'Biomedical engineers use silk-based materials for sutures, wound dressings, and tissue engineering scaffolds',
        ],
        'project': {
            'title': 'Test and Compare Fiber Strengths',
            'description': 'Measure the tensile strength of different fibers (cotton, silk, nylon, hair) by hanging weights until they break.',
            'steps': [
                'Gather single strands of cotton thread, silk thread, nylon fishing line, and human hair',
                'Tie each to a support and hang increasing weights (coins or washers) from the bottom',
                'Record the weight at which each fiber breaks',
                'Calculate tensile strength by dividing breaking force by estimated fiber cross-section area',
                'Create a strength comparison chart and explain why silk is stronger than steel by weight',
            ],
        },
    },
    'tejimola-the-girl-who-became-a-plant': {
        'skills': [
            'Understand plant growth from cuttings: vegetative propagation and totipotency',
            'Analyze the role of plant hormones (auxin, cytokinin) in root and shoot development',
            'Model nutrient uptake and transport in plants: xylem and phloem function',
            'Compare sexual reproduction (seeds) with asexual reproduction (cuttings, tubers, runners)',
        ],
        'realWorld': [
            'Farmers propagate fruit trees, grapes, and roses through cuttings to preserve desired traits',
            'Tissue culture laboratories mass-produce disease-free banana and orchid plants from tiny cell samples',
            'Biotechnology companies use plant totipotency to genetically engineer crops',
        ],
        'project': {
            'title': 'Grow Plants from Cuttings and Track Success Rates',
            'description': 'Test which plants can grow from cuttings, and how rooting hormone and water vs soil affect success.',
            'steps': [
                'Take cuttings from 4-5 different plants (mint, basil, rose, pothos, money plant)',
                'For each plant, place one cutting in water and one in soil',
                'Optionally treat one set with rooting hormone (honey works as a mild natural alternative)',
                'Track root development and new leaf growth daily for 3 weeks',
                'Calculate the success rate for each plant and each method, and identify the easiest plants to propagate',
            ],
        },
    },
    'golden-deer-of-kamakhya': {
        'skills': [
            'Understand bioluminescence and fluorescence in animals: the biochemistry of glowing',
            'Analyze how light interacts with biological pigments and structural color',
            'Model the evolutionary advantage of coloration: warning, camouflage, and mate attraction',
            'Compare natural fluorescence with human-made fluorescent materials',
        ],
        'realWorld': [
            'Forensic scientists use UV fluorescence to detect biological evidence invisible to the naked eye',
            'Marine biologists discover new fluorescent organisms in deep ocean environments every year',
            'Security features on banknotes and documents use fluorescent inks visible only under UV light',
        ],
        'project': {
            'title': 'Explore Fluorescence in Everyday Objects',
            'description': 'Use a UV light to discover which common materials fluoresce, and explain the physics behind each glow.',
            'steps': [
                'Obtain a UV flashlight (blacklight) and gather test objects: white paper, tonic water, highlighter ink, laundry detergent, minerals',
                'Shine the UV light on each object in a dark room and record the color of fluorescence',
                'Research the fluorescent compound in each object (quinine in tonic water, optical brighteners in paper)',
                'Explain the energy conversion: UV photon absorbed, lower-energy visible photon emitted',
                'Test natural objects (flowers, scorpions in photos, teeth) and discuss why some organisms fluoresce',
            ],
        },
    },
    'boy-who-talked-to-clouds': {
        'skills': [
            'Understand cloud formation processes: convection, orographic lift, and frontal lifting',
            'Analyze weather data from stations and satellites to predict precipitation',
            'Model the water cycle quantitatively: evaporation, condensation, and precipitation rates',
            'Design simple weather instruments: rain gauge, barometer, hygrometer',
        ],
        'realWorld': [
            'Meteorologists combine satellite cloud imagery with surface data for accurate weather forecasts',
            'Farmers use cloud reading as a traditional skill alongside modern weather apps for planting decisions',
            'Climate models simulate cloud formation to predict future rainfall patterns under global warming',
        ],
        'project': {
            'title': 'Build a Weather Station and Predict the Weather',
            'description': 'Construct simple weather instruments, collect data daily, and develop your own local weather prediction model.',
            'steps': [
                'Build 3 instruments: a rain gauge (funnel + measuring cylinder), a barometer (jar + balloon + straw), and a wind vane',
                'Record daily measurements at the same time: rainfall, pressure trend (rising/falling), wind direction, and temperature',
                'After 2 weeks, look for patterns: does falling pressure predict rain within 24 hours?',
                'Create prediction rules based on your data (e.g., if pressure drops and wind shifts south, expect rain)',
                'Test your rules for 1 week and compare with the official weather forecast accuracy',
            ],
        },
    },
    'how-majuli-island-was-born': {
        'skills': [
            'Understand fluvial geomorphology: how rivers deposit sediment and form islands',
            'Analyze the processes of river erosion and accretion that shape riverine islands',
            'Model island area change over time using historical map data',
            'Calculate sediment transport rates from flow velocity and particle size',
        ],
        'realWorld': [
            'Geographers monitor Majuli — the world\'s largest river island — which is shrinking due to erosion',
            'River engineers design bank protection structures to slow island erosion and flooding',
            'Climate change researchers study how altered river flows affect delta and island formation globally',
        ],
        'project': {
            'title': 'Track Island Erosion Using Satellite Images',
            'description': 'Compare satellite images of Majuli island from different years to calculate the rate of area loss and predict its future size.',
            'steps': [
                'Find satellite images of Majuli from 3-4 different decades (Google Earth historical imagery)',
                'Trace the island outline in each image and estimate its area using a grid overlay',
                'Calculate the erosion rate in square kilometers per year',
                'Plot island area vs year and fit a trend line',
                'Extrapolate to predict when the island will lose 50% of its current area at the current rate',
            ],
        },
    },
    'bamboo-flute-of-nagaland': {
        'skills': [
            'Understand the acoustics of wind instruments: air columns, nodes, and antinodes',
            'Calculate the frequencies produced by open and closed tubes of different lengths',
            'Analyze how finger hole placement changes the effective tube length and pitch',
            'Model the timbre of a flute: fundamental frequency plus harmonics',
        ],
        'realWorld': [
            'Musical instrument makers use acoustic calculations to place finger holes precisely on flutes',
            'Audio engineers synthesize realistic flute sounds for digital music production',
            'Archaeologists study ancient flutes to understand the music and culture of past civilizations',
        ],
        'project': {
            'title': 'Design a Bamboo Flute Using Physics Calculations',
            'description': 'Calculate where to place finger holes on a bamboo tube to produce a specific musical scale, then build and test it.',
            'steps': [
                'Measure the inner diameter and length of a bamboo tube',
                'Calculate the fundamental frequency of the open tube using f = v / 2L',
                'Calculate the positions of 6 finger holes to produce a major scale',
                'Drill (or mark) the holes and test each note with a tuner app',
                'Adjust hole sizes to fine-tune the notes and document the corrections needed',
            ],
        },
    },
    'dancing-deer-of-loktak-lake': {
        'skills': [
            'Understand endangered species ecology: habitat requirements, population dynamics, and threats',
            'Analyze the unique floating phumdi ecosystem of Loktak Lake',
            'Model population viability analysis for the Sangai deer',
            'Interpret camera trap and census data for wildlife monitoring',
        ],
        'realWorld': [
            'The Sangai (brow-antlered deer) exists only on the floating phumdi of Loktak Lake — about 260 individuals remain',
            'Conservation biologists use population viability analysis to set recovery targets for endangered species',
            'Wetland management decisions (water level control, phumdi management) directly affect Sangai survival',
        ],
        'project': {
            'title': 'Model an Endangered Species Population Recovery',
            'description': 'Simulate the Sangai deer population under different conservation scenarios to find what it takes to prevent extinction.',
            'steps': [
                'Start with the current estimated population (~260 deer) and set birth/death rates from published data',
                'Simulate population trajectory over 50 years with no intervention (baseline scenario)',
                'Add conservation actions: predator control, habitat expansion, and reduced human disturbance',
                'Model the effect of catastrophic events (flood, disease) occurring randomly',
                'Identify the minimum conservation effort needed to maintain a viable population (>500 individuals)',
            ],
        },
    },
    'bridge-that-grew': {
        'skills': [
            'Understand the biology of aerial root growth in Ficus elastica (rubber fig)',
            'Analyze living root bridge engineering: how roots are trained into load-bearing structures',
            'Model tensile strength development in roots over decades of growth',
            'Compare bio-architecture with conventional bridge engineering',
        ],
        'realWorld': [
            'Meghalaya\'s living root bridges are UNESCO-nominated engineering marvels that strengthen over centuries',
            'Bio-architecture researchers explore growing building materials as a sustainable construction method',
            'Structural engineers study how biological structures self-repair, unlike concrete and steel',
        ],
        'project': {
            'title': 'Compare Living and Conventional Bridge Strengths',
            'description': 'Research and compare the structural properties of living root bridges with concrete and steel bridges of similar size.',
            'steps': [
                'Research the dimensions and estimated load capacity of Meghalaya\'s major root bridges',
                'Find published data on the tensile strength and elasticity of Ficus elastica roots',
                'Compare root strength per unit area with steel cable and concrete beam strength',
                'Calculate the theoretical load limit of a root bridge vs a similar-sized conventional bridge',
                'Discuss the unique advantages of living bridges: self-repair, increasing strength with age, zero carbon footprint',
            ],
        },
    },
}

# Aliases for short-slug duplicates that share the same STEM topic
STEM_CONTENT['orange-sunsets'] = STEM_CONTENT['orange-sunsets-assam']
STEM_CONTENT['map-maker'] = STEM_CONTENT['map-makers-granddaughter']
STEM_CONTENT['fisherman-storm'] = STEM_CONTENT['fishermans-daughter-storm']
STEM_CONTENT['honey-hunter'] = STEM_CONTENT['honey-hunters-lesson']
STEM_CONTENT['snow-leopard'] = STEM_CONTENT['snow-leopards-promise']
STEM_CONTENT['tiger-whisker'] = STEM_CONTENT['tigers-whisker']

def esc(s):
    """Escape single quotes for TypeScript single-quoted strings."""
    return s.replace("'", "\\'")


def main():
    with open(LESSONS_PATH, 'r') as f:
        content = f.read()

    replaced = 0
    missing = []

    for slug, data in STEM_CONTENT.items():
        skills = data['skills']
        real_world = data['realWorld']
        project = data['project']

        # Format skills array
        skills_str = ', '.join(f"'{esc(s)}'" for s in skills)

        # Format realWorld array
        rw_lines = []
        for rw in real_world:
            rw_lines.append(f"        '{esc(rw)}',")
        rw_str = '\n'.join(rw_lines)

        # Format project
        steps_lines = []
        for step in project['steps']:
            steps_lines.append(f"          '{esc(step)}',")
        steps_str = '\n'.join(steps_lines)

        proj_str = f"""{{
        title: '{esc(project['title'])}',
        description: '{esc(project['description'])}',
        steps: [
{steps_str}
        ],
      }}"""

        # Now find and replace in the content
        # We need to find the stem block for this slug
        # Pattern: after slug: 'xxx', find skills: [], project: { title: '', ... }, realWorld: []

        # Find the slug position
        slug_pattern = f"slug: '{slug}'"
        slug_pos = content.find(slug_pattern)
        if slug_pos == -1:
            missing.append(slug)
            continue

        # Find the next slug or end of file to limit our search
        next_slug_pos = content.find("slug: '", slug_pos + len(slug_pattern))
        if next_slug_pos == -1:
            next_slug_pos = len(content)

        block = content[slug_pos:next_slug_pos]

        # Replace skills: []
        if 'skills: []' not in block:
            # Already has skills, skip
            continue

        new_block = block.replace(
            'skills: []',
            f'skills: [{skills_str}]',
            1
        )

        # Replace realWorld: []
        new_block = new_block.replace(
            'realWorld: []',
            f"""realWorld: [
{rw_str}
      ]""",
            1
        )

        # Replace project: { title: '', description: '', steps: [] }
        new_block = new_block.replace(
            "project: { title: '', description: '', steps: [] }",
            f"project: {proj_str}",
            1
        )

        content = content[:slug_pos] + new_block + content[next_slug_pos:]
        replaced += 1

    with open(LESSONS_PATH, 'w') as f:
        f.write(content)

    print(f"Replaced STEM content for {replaced} stories.")
    if missing:
        print(f"WARNING: Could not find slugs: {missing}")

    # Verify
    remaining_empty = content.count("skills: []")
    print(f"Remaining empty skills: {remaining_empty}")
    remaining_proj = content.count("project: { title: '', description: '', steps: [] }")
    print(f"Remaining empty projects: {remaining_proj}")

if __name__ == '__main__':
    main()
