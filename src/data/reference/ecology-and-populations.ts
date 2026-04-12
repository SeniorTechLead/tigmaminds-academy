import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'ecology-and-populations',
  title: 'Ecology & Population Science',
  category: 'ecology',
  icon: '🌿',
  tagline: 'How populations grow, ecosystems connect, and species survive — or don\'t.',
  relatedStories: ['dancing-deer-of-loktak-lake', 'kaziranga-grass', 'elephant-corridor', 'golden-hilsa', 'girl-grew-forest', 'honey-hunters-lesson'],
  understand: [
    {
      title: 'What Is an Ecosystem?',
      beginnerContent: 'An ecosystem is everything in a place — living and non-living — and how it all connects. Loktak Lake in Manipur is an ecosystem: the water, the floating phumdis, the sangai deer, the fish, the insects, the sunlight, the bacteria in the mud. Remove one piece and the others change.\n\nEcosystems have **producers** (plants that make food from sunlight), **consumers** (animals that eat plants or other animals), and **decomposers** (fungi and bacteria that break down dead matter). Energy flows from sun to producer to consumer. Nutrients cycle through the whole system.\n\nThe Brahmaputra river is an ecosystem. So is a rice paddy. So is a rotting log. Size doesn\'t matter — what matters is the web of connections.',
      intermediateContent:
        'Ecosystem productivity is measured as **GPP** (Gross Primary Productivity) — the total energy fixed by photosynthesis. **NPP** (Net Primary Productivity) = GPP − respiration. Tropical forests: NPP ≈ 1,000-3,500 g C/m²/year. Open ocean: NPP ≈ 125 g C/m²/year. Wetlands like Loktak Lake: NPP ≈ 1,000-2,500 g C/m²/year — extremely productive. The **10% rule**: roughly 10% of energy transfers between trophic levels (the rest is lost as heat). If producers fix 10,000 kJ/m²/year, primary consumers get ~1,000 kJ, secondary consumers ~100 kJ, top predators ~10 kJ. This is why food chains rarely exceed 4-5 levels — there is not enough energy left.',
      advancedContent:
        'Ecosystem dynamics are modeled using **compartment models** with differential equations for energy/nutrient flow: dB_i/dt = inputs − outputs − respiration. The **Lindeman efficiency** (trophic transfer efficiency) varies from 5-20% depending on the ecosystem. **Odum\'s systems ecology** treats ecosystems as thermodynamic systems, where the second law guarantees that energy dissipates at each transfer. **Emergy analysis** (embodied energy) accounts for all the energy historically required to produce a resource, measured in solar emjoules. Recent research uses **eddy covariance towers** to measure CO₂ and water vapor fluxes continuously, providing real-time GPP estimates for entire ecosystems. Global NPP is estimated at ~120 Pg C/year on land and ~50 Pg C/year in oceans — and satellite-based NDVI (Normalized Difference Vegetation Index) tracks changes in global productivity, revealing that Earth has been "greening" (increasing leaf area) due to CO₂ fertilization, even as biodiversity declines.',
    },
    {
      title: 'Food Chains and Food Webs',
      beginnerContent: 'A **food chain** is a single path of who-eats-whom: grass → grasshopper → frog → snake → eagle. Energy transfers at each step, but about 90% is lost as heat at every level. That\'s why there are fewer eagles than grasshoppers — the top of the chain gets the least energy.\n\nA **food web** is what actually happens — multiple chains woven together. The frog also eats flies. The snake also eats mice. The eagle also eats rabbits. Real ecosystems are messy networks, not neat chains.\n\nIn Kaziranga, elephant grass is the base producer. It feeds rhinos, deer, wild buffalo. They feed tigers. Remove the grass (through fire suppression or development) and the entire web collapses from the bottom up.',
      intermediateContent:
        'Energy transfer can be quantified with an **ecological pyramid**. If Kaziranga grassland produces 20,000 kJ/m²/year, and trophic efficiency is 10%: herbivores (rhinos, deer) get ~2,000 kJ/m²/year, secondary consumers (small predators) get ~200, and tigers get ~20. **Biomass pyramids** show mass at each level: producers ~1,000 g/m², herbivores ~100 g/m², top predators ~1 g/m². The **food chain length** (FCL) can be estimated using **stable isotope analysis**: the ratio of ¹⁵N to ¹⁴N (δ¹⁵N) increases by ~3.4‰ per trophic level. If grass δ¹⁵N = 2‰ and a tiger\'s δ¹⁵N = 12‰, the tiger feeds at trophic level 1 + (12−2)/3.4 ≈ **3.9** — roughly a fourth-level consumer.',
      advancedContent:
        '**Network analysis** of food webs uses **connectance** (C = L/S², where L = number of links, S = number of species) to characterize web complexity. Most real webs have C ≈ 0.1-0.15. **Keystone species** (Paine, 1969) have disproportionate effects relative to their abundance — removing sea otters from kelp forests causes urchin populations to explode, destroying the kelp (a trophic cascade). The **Lotka-Volterra competition equations** model two competing species: dN₁/dt = r₁N₁(K₁ − N₁ − α₁₂N₂)/K₁, where α₁₂ is the competition coefficient. Coexistence requires each species to limit itself more than it limits the other (α₁₂α₂₁ < 1). Modern food web ecology uses **structural equation modeling** and **Bayesian network analysis** to disentangle direct and indirect effects in complex webs with hundreds of species.',
      diagram: 'FoodWebDiagram',
    },
    {
      title: 'Population Growth — Exponential vs Logistic',
      beginnerContent: 'When a population has unlimited food and space, it grows **exponentially** — each generation is bigger than the last by a constant multiplier. Two rabbits become 4, then 8, 16, 32, 64. The growth curve shoots upward like a hockey stick.\n\nBut no environment has unlimited resources. Eventually, food runs short, disease spreads in crowded conditions, or predators multiply to match the prey. The population hits a ceiling called the **carrying capacity** — the maximum number the environment can sustain. Growth slows and levels off. This S-shaped curve is called **logistic growth**.\n\nThe sangai deer of Loktak Lake have a carrying capacity determined by how much phumdi habitat remains. With only enough floating islands for about 300 deer, that\'s the ceiling — unless habitat is restored.',
      intermediateContent:
        'Exponential growth: **dN/dt = rN**, where r is the intrinsic growth rate (births − deaths per capita). Solution: **N(t) = N₀ × e^(rt)**. If r = 0.05/year and N₀ = 100: after 10 years, N = 100 × e^(0.5) = **165**. After 50 years: N = 100 × e^(2.5) = **1,218**. **Doubling time** = ln(2)/r = 0.693/0.05 = **13.9 years**. Logistic growth: **dN/dt = rN(1 − N/K)**, where K is carrying capacity. As N approaches K, the (1 − N/K) term shrinks toward 0, slowing growth. At N = K/2, growth rate is maximum. Solution: **N(t) = K/(1 + ((K−N₀)/N₀) × e^(−rt))**. **r-selected species** (insects, bacteria): high r, small body, many offspring, boom-bust cycles. **K-selected species** (elephants, tigers): low r, large body, few offspring, stable near K.',
      advancedContent:
        'The **Lotka-Volterra predator-prey model**: dN/dt = rN − aNP (prey), dP/dt = baNP − mP (predator), where a = attack rate, b = conversion efficiency, m = predator death rate. Solutions are neutrally stable cycles — predator and prey populations oscillate with the predator lagging behind. Adding density dependence to prey: dN/dt = rN(1 − N/K) − aNP produces **damped oscillations** converging to a stable equilibrium. Real populations show more complex dynamics: the **Ricker model** N(t+1) = N(t) × e^(r(1−N(t)/K)) exhibits period-doubling cascades leading to **deterministic chaos** when r > 2.69 — identical mathematical behavior to the logistic map, one of the foundational discoveries of chaos theory (May, 1976). Conservation biologists use **population viability analysis** (PVA) with stochastic simulations to estimate extinction probability — for the sangai deer, models suggest habitat restoration increasing K from 300 to 500 would reduce 50-year extinction probability from ~30% to below 5%.',
      diagram: 'PopulationGrowthCurve',
    },
    {
      title: 'Carrying Capacity and Why It Matters',
      beginnerContent: 'Carrying capacity isn\'t fixed — it changes when the environment changes. Build a dam that alters Loktak Lake\'s water levels? The phumdis thin, carrying capacity drops, and sangai numbers fall. Restore the wetland? Carrying capacity rises.\n\n**Minimum viable population** is the smallest number a species needs to survive long-term. Below that number, inbreeding weakens the population, random events (a bad storm, a disease outbreak) can wipe everyone out, and genetic diversity is too low to adapt to change. For most large mammals, the minimum viable population is 500-5,000 individuals. The sangai\'s 300 is dangerously close to the edge.\n\nThis is why conservationists don\'t just count animals — they manage habitat to raise the carrying capacity.',
      intermediateContent:
        'Carrying capacity depends on **limiting factors**: the resource in shortest supply relative to demand (Liebig\'s law of the minimum). For sangai deer, the limiting factor is phumdi area. If each deer needs ~0.5 km² and total phumdi area is 150 km², then K ≈ 300. The **minimum viable population** (MVP) can be estimated using the **50/500 rule** (Franklin, 1980): 50 individuals to avoid short-term inbreeding depression, 500 to maintain long-term evolutionary potential. More refined models use **effective population size** N_e, which accounts for unequal sex ratios, variance in reproductive success, and population fluctuations: **N_e = 4N_f × N_m / (N_f + N_m)** for sex ratio effects. If 300 sangai include 100 males and 200 females: N_e = 4×200×100/300 = **267** — lower than the census count and dangerously close to critical thresholds.',
      advancedContent:
        'The **Allee effect** describes a counterintuitive phenomenon where per-capita growth rate *decreases* at low population density (the opposite of density-dependent limitation at high density). Causes include difficulty finding mates, reduced predator defense (herds are safer), and loss of genetic diversity. Mathematically: dN/dt = rN(N/A − 1)(1 − N/K), where A is the Allee threshold — below A, growth rate becomes negative and the population spirals to extinction. This creates a **critical threshold** below which recovery is impossible without intervention. **Metapopulation theory** (Levins, 1969) models multiple sub-populations connected by dispersal: dp/dt = cp(1−p) − ep, where p is the fraction of occupied patches, c is colonization rate, and e is extinction rate. At equilibrium, p* = 1 − e/c. This framework guides corridor design: connecting habitat fragments increases c, raising the equilibrium occupancy. Conservation genetics now uses **genomic sequencing** to measure inbreeding coefficients, identify adaptive alleles, and guide genetic rescue — transferring individuals between populations to restore genetic diversity.',
    },
    {
      title: 'Biodiversity — Why Variety Matters',
      beginnerContent: 'Biodiversity is the variety of life in an ecosystem — how many different species live there and how genetically varied each species is. High biodiversity makes ecosystems more resilient. If one species of pollinator disappears, others can fill the gap. If one crop variety fails, others with different disease resistance survive.\n\nNortheast India is one of the world\'s 36 biodiversity hotspots — regions with extraordinary species richness that are also under threat. The Western Ghats and the Indo-Burma region (which includes NE India) together hold more plant species than all of Europe.\n\nLosing biodiversity is like removing rivets from an airplane wing. Lose one, nothing happens. Lose ten, probably fine. But at some point — which you can\'t predict in advance — the wing falls off.',
    },
    {
      title: 'Conservation Strategies',
      beginnerContent: 'Conservation isn\'t just about saving cute animals. It\'s about maintaining the ecosystem services that all life (including humans) depends on: clean water, pollination, flood control, carbon storage, soil fertility.\n\n**Protected areas** (like Keibul Lamjao National Park for the sangai) set aside habitat. **Wildlife corridors** (like the elephant corridors in Assam) connect fragmented habitats so animals can move between them. **Community conservation** involves local people in management — because the people who live alongside wildlife have the most at stake and the most knowledge.\n\nThe most effective conservation combines all three: protect core habitat, connect it with corridors, and involve communities in stewardship.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A population can grow exponentially forever.', answer: false, explanation: 'Exponential growth requires unlimited resources, which never exist in nature. Eventually, carrying capacity limits growth.' },
            { text: 'Removing one species from an ecosystem can affect species it never directly interacts with.', answer: true, explanation: 'Indirect effects ripple through food webs. Removing wolves from Yellowstone caused elk overpopulation, which destroyed riverside vegetation, which caused river erosion. The wolves never touched a river.' },
            { text: 'The most biodiverse ecosystems are always the largest ones.', answer: false, explanation: 'Small tropical islands and coral reefs can have extraordinary biodiversity. Northeast India is a biodiversity hotspot despite being geographically small. Diversity depends on climate, habitat variety, and evolutionary history — not just area.' },
          ],
        },
      },
    },
    {
      title: 'Signal Detection Theory',
      beginnerContent:
        'Imagine you are a wildlife ranger in Kaziranga, listening through headphones connected to an acoustic sensor for the sound of a poacher\'s gunshot. The forest is full of noise — branches cracking, animals calling, thunder rumbling. Your task is to detect a real signal (gunshot) against a background of random noise. Sometimes you will correctly identify a gunshot (**hit**). Sometimes a loud branch crack will fool you into raising a false alarm (**false positive**). Sometimes a distant gunshot will be too faint and you will miss it (**miss**). And sometimes the forest is quiet and you correctly conclude there is no threat (**correct rejection**).\n\n' +
        '**Signal Detection Theory** (SDT) is a mathematical framework that analyses exactly this kind of decision-making. It applies whenever someone — or something — must decide whether a signal is present or absent in the presence of uncertainty. It is used in medicine (does this X-ray show a tumour, or is the shadow just normal tissue?), radar (is that blip an aircraft or a flock of birds?), quality control (is that product defective or within tolerance?), and ecology (is that camera-trap image a tiger or a large dog?).\n\n' +
        'SDT separates two independent factors. **Sensitivity** (called d-prime, written d\') measures how well you can actually distinguish signal from noise — a sharp-eared ranger with good equipment has high d\'. **Response bias** (called the criterion, c) measures your willingness to say "yes, there is a signal" — a cautious ranger who only reports definite gunshots has a high (strict) criterion, while one who reports every suspicious sound has a low (liberal) criterion. The beauty of SDT is that it disentangles these two factors, letting you evaluate the quality of a detector independently from its decision strategy.\n\n' +
        'The **ROC curve** (Receiver Operating Characteristic) plots hit rate against false alarm rate as the criterion varies. A perfect detector produces a curve that hugs the top-left corner; a useless detector (pure guessing) falls on the diagonal. The area under the ROC curve (AUC) is a single number summarising overall detection ability: AUC = 1.0 is perfect, AUC = 0.5 is chance.',
      intermediateContent:
        'In SDT, both noise-alone and signal-plus-noise produce bell-shaped (Gaussian) distributions of sensory evidence. **d\' = (μ_signal − μ_noise) / σ** measures the separation between the two distributions in standard deviation units. d\' = 0 means complete overlap (no ability to detect); d\' = 3 means clear separation (excellent detection). The **criterion** c = −0.5 × (z(hit rate) + z(false alarm rate)), where z is the inverse normal CDF. A neutral criterion (c = 0) sits midway between the distributions. In medical screening, **sensitivity** = hit rate = true positives / (true positives + false negatives). **Specificity** = 1 − false alarm rate = true negatives / (true negatives + false positives). A COVID test with 95% sensitivity and 99% specificity applied to a population with 1% prevalence: positive predictive value = (0.01 × 0.95) / (0.01 × 0.95 + 0.99 × 0.01) = 0.0095/0.0194 = **49%** — half of positive results are false alarms. This counterintuitive result (base rate fallacy) is one of SDT\'s most important practical lessons.',
      advancedContent:
        'The ROC curve for Gaussian equal-variance SDT is parameterised by: hit rate = Φ(d\'/2 − c) and false alarm rate = Φ(−d\'/2 − c), where Φ is the standard normal CDF. The area under the ROC curve **AUC = Φ(d\'/√2)**. For d\' = 1: AUC = Φ(0.707) = **0.76**. For d\' = 2: AUC = **0.92**. For d\' = 3: AUC = **0.98**. Unequal-variance models (σ_signal ≠ σ_noise) produce asymmetric ROC curves on z-coordinates, common in recognition memory research. **Bayesian SDT** incorporates prior probabilities: the optimal criterion minimises expected cost by placing it where the likelihood ratio L(x) = f(x|signal)/f(x|noise) equals (cost_FA × P(noise)) / (cost_miss × P(signal)). Machine learning classifiers are evaluated using ROC/AUC analysis directly descended from SDT — the field originated in 1940s radar engineering (Peterson, Birdsall, Fox at the University of Michigan) and was formalised by Green and Swets (1966). Modern applications include **deep learning calibration** and **fairness metrics** that decompose classifier performance across demographic groups.',
    },
    {
      title: 'SIR Epidemic Model',
      diagram: 'SIRModelDiagram',
      beginnerContent:
        'When a new disease spreads through a community, how can scientists predict how many people ' +
        'will get sick and when the outbreak will peak? The **SIR model** is a simple but powerful ' +
        'framework that divides a population into three groups — or **compartments** — and tracks ' +
        'how people flow between them.\n\n' +
        '**S — Susceptible**: People who have not yet been infected and can catch the disease. At the ' +
        'start of an outbreak, nearly everyone is in this group.\n\n' +
        '**I — Infected**: People who currently have the disease and can spread it to susceptible people. ' +
        'Each infected person contacts others at a certain rate, and some of those contacts result in ' +
        'new infections.\n\n' +
        '**R — Recovered** (or Removed): People who have recovered and are now immune, or who have died. ' +
        'They can no longer catch or spread the disease.\n\n' +
        'The key number is **R₀** (pronounced "R-naught") — the **basic reproduction number**. It tells ' +
        'you how many new people one infected person will infect on average in a fully susceptible ' +
        'population. If R₀ > 1, the disease spreads and an epidemic occurs. If R₀ < 1, the disease ' +
        'dies out. Measles has R₀ ≈ 12-18, making it extraordinarily contagious. Seasonal flu has ' +
        'R₀ ≈ 1.3. COVID-19\'s original strain had R₀ ≈ 2.5-3.\n\n' +
        'Vaccination works by moving people directly from S to R without going through I. When enough ' +
        'people are immune — the **herd immunity threshold** — the disease cannot sustain transmission. ' +
        'This threshold is approximately 1 - 1/R₀. For measles (R₀ ≈ 15), about 93% of the population ' +
        'must be immune to stop outbreaks.',
      intermediateContent:
        'The SIR differential equations: **dS/dt = -βSI/N**, **dI/dt = βSI/N - γI**, **dR/dt = γI**, ' +
        'where β is the transmission rate (contacts per time × probability of transmission per contact), ' +
        'γ is the recovery rate (1/γ = average infectious period), and N = S + I + R is the total ' +
        'population. R₀ = β/γ. The epidemic peaks when dI/dt = 0, i.e., when S = N/R₀ = γN/β. The ' +
        'herd immunity threshold H = 1 - 1/R₀. For R₀ = 3: H = 67%. The **final size equation** ' +
        '1 - R_∞/N = e^(-R₀ × R_∞/N) gives the total fraction infected. For R₀ = 3, approximately ' +
        '94% of the population is eventually infected without intervention.',
      advancedContent:
        'Extensions include SEIR (adding an Exposed/latent compartment), SIS (no lasting immunity), ' +
        'SIRS (waning immunity), and age-structured models with contact matrices. The **effective ' +
        'reproduction number** R_t = R₀ × S(t)/N tracks real-time transmissibility. Stochastic SIR ' +
        'models handle small populations where random extinction of the infected class is possible. ' +
        'Network-based SIR models replace the homogeneous mixing assumption with realistic contact ' +
        'networks — on scale-free networks, super-spreader hubs dramatically alter epidemic dynamics ' +
        'and the herd immunity threshold depends on the degree distribution variance, not just R₀.',
    },
  ]
};
