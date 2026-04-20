import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'ecology-and-populations',
  title: 'Ecology & Population Science',
  category: 'ecology',
  icon: '🌿',
  tagline: 'How populations grow, ecosystems connect, and species survive — or don\'t.',
  relatedStories: ['dancing-deer-of-loktak-lake', 'kaziranga-grass', 'elephant-corridor', 'golden-hilsa', 'girl-grew-forest', 'honey-hunters-lesson'],
  understand: [
    // ── Section 1: What Is an Ecosystem? ─────────────────────────
    {
      title: 'What Is an Ecosystem?',
      diagram: 'ElephantEcosystemDiagram',
      beginnerContent:
        'Imagine a lake. Now zoom in. There\'s water, mud, sunlight, bacteria in the sediment, algae on the surface, fish in the middle, birds overhead, and deer drinking at the edge. All of it — living and non-living — interacting together. That\'s an **ecosystem**.\n\n' +
        'Every ecosystem has three types of players:\n\n' +
        '| Role | What they do | Examples |\n' +
        '|------|-------------|----------|\n' +
        '| **Producers** | Make food from sunlight (photosynthesis) | Grass, algae, phytoplankton |\n' +
        '| **Consumers** | Eat other organisms for energy | Insects, fish, deer, tigers |\n' +
        '| **Decomposers** | Break down dead matter, recycle nutrients | Fungi, bacteria, earthworms |\n\n' +
        'Energy flows in one direction: sun → producers → consumers → heat. But **nutrients cycle** — carbon, nitrogen, and phosphorus loop endlessly through soil, water, organisms, and atmosphere.\n\n' +
        'An ecosystem can be enormous (the Amazon basin) or tiny (a rotting log). Loktak Lake in Manipur is an ecosystem: water, floating phumdi islands, sangai deer, fish, insects, and bacteria all connected. A rice paddy is another. The Brahmaputra floodplain is another. What matters is not size — it\'s the **web of connections**.\n\n' +
        '**Think of it this way:** An ecosystem is like a city. Producers are the farms and power plants. Consumers are the residents. Decomposers are the waste-management system. Remove any one and the city breaks down.',
      intermediateContent:
        '**How productive is an ecosystem?**\n\n' +
        'Ecosystem productivity is measured in grams of carbon fixed per square metre per year:\n\n' +
        '| Ecosystem type | NPP (g C/m²/year) | Why? |\n' +
        '|----------------|-------------------|------|\n' +
        '| Tropical rainforest | 1,000–3,500 | Warm, wet, year-round sunlight |\n' +
        '| Temperate grassland | 200–1,500 | Seasonal, moderate rain |\n' +
        '| Freshwater wetland | 1,000–2,500 | Nutrient-rich, sunlit shallows |\n' +
        '| Open ocean | 50–200 | Nutrient-poor surface waters |\n' +
        '| Desert | 0–250 | Water-limited |\n\n' +
        '**GPP** (Gross Primary Productivity) is the total energy fixed by photosynthesis. **NPP** (Net Primary Productivity) = GPP minus respiration — the energy actually available to the rest of the food web.\n\n' +
        '**The 10% rule:** Roughly 10% of energy transfers between trophic levels. The rest is lost as heat (second law of thermodynamics). If producers fix 10,000 kJ/m²/year:\n\n' +
        '| Trophic level | Energy available (kJ/m²/yr) |\n' +
        '|---------------|----------------------------|\n' +
        '| Producers | 10,000 |\n' +
        '| Primary consumers (herbivores) | ~1,000 |\n' +
        '| Secondary consumers (small predators) | ~100 |\n' +
        '| Tertiary consumers (top predators) | ~10 |\n\n' +
        'This is why food chains rarely exceed 4–5 levels — there simply isn\'t enough energy left at the top.',
      advancedContent:
        '**Compartment models** describe ecosystem dynamics with differential equations for energy and nutrient flow:\n\n' +
        'dB_i/dt = inputs − outputs − respiration\n\n' +
        'The **Lindeman efficiency** (trophic transfer efficiency) varies by ecosystem:\n\n' +
        '| Ecosystem | Typical efficiency | Reason |\n' +
        '|-----------|-------------------|--------|\n' +
        '| Aquatic (plankton-based) | 15–20% | Small ectotherms, low respiration |\n' +
        '| Terrestrial forest | 5–10% | Large endotherms, high respiration |\n' +
        '| Grassland grazers | 10–15% | Intermediate body sizes |\n\n' +
        '**Odum\'s systems ecology** treats ecosystems as thermodynamic systems where the second law guarantees energy dissipation at each transfer. **Emergy analysis** (embodied energy) accounts for all the energy historically required to produce a resource, measured in solar emjoules.\n\n' +
        'Modern monitoring uses **eddy covariance towers** to measure CO2 and water vapour fluxes continuously, providing real-time GPP estimates. Global NPP is estimated at ~120 Pg C/year on land and ~50 Pg C/year in oceans. Satellite-based **NDVI** (Normalised Difference Vegetation Index) tracks changes in global productivity — revealing that Earth has been "greening" (increasing leaf area) due to CO2 fertilisation, even as biodiversity declines.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each ecosystem role to its function',
          pairs: [
            ['Producers', 'Convert sunlight to chemical energy via photosynthesis'],
            ['Primary consumers', 'Herbivores that eat producers directly'],
            ['Decomposers', 'Break down dead matter and recycle nutrients to soil'],
            ['Tertiary consumers', 'Top predators at the highest trophic level'],
          ],
        },
      },
    },

    // ── Section 2: Food Chains and Food Webs ─────────────────────
    {
      title: 'Food Chains and Food Webs',
      diagram: 'FoodWebDiagram',
      beginnerContent:
        'A **food chain** is a single path of who-eats-whom:\n\n' +
        'Grass → Grasshopper → Frog → Snake → Eagle\n\n' +
        'Energy transfers at each step, but about 90% is lost as heat at every level. That\'s why there are fewer eagles than grasshoppers — the top of the chain gets the least energy.\n\n' +
        'But nature is rarely that simple. A **food web** is what actually happens — multiple chains woven together. The frog also eats flies. The snake also eats mice. The eagle also eats rabbits. Real ecosystems are messy networks, not neat lines.\n\n' +
        '| Type | What it means | Example |\n' +
        '|------|-------------|--------|\n' +
        '| **Food chain** | One path, one direction | Grass → Rhino → Tiger |\n' +
        '| **Food web** | Many overlapping chains | Grass feeds rhinos, deer, and buffalo; all are tiger prey |\n' +
        '| **Trophic level** | Your position in the chain | Grass = level 1, rhino = level 2, tiger = level 3 |\n\n' +
        'In Kaziranga, elephant grass is the base producer. It feeds rhinos, swamp deer, and wild buffalo. They feed tigers. Remove the grass — through fire suppression or development — and the entire web collapses from the bottom up.\n\n' +
        '**Think of it this way:** A food chain is like a single road. A food web is the entire road network. Block one road and traffic reroutes. But block a major highway and the whole system jams.',
      intermediateContent:
        '**Quantifying energy flow with ecological pyramids:**\n\n' +
        'If Kaziranga grassland produces 20,000 kJ/m²/year and trophic efficiency is 10%:\n\n' +
        '| Trophic level | Energy (kJ/m²/yr) | Biomass (g/m²) | Example organisms |\n' +
        '|---------------|-------------------|----------------|-------------------|\n' +
        '| Producers (T1) | 20,000 | ~1,000 | Elephant grass, reeds |\n' +
        '| Herbivores (T2) | ~2,000 | ~100 | Rhinos, swamp deer |\n' +
        '| Secondary consumers (T3) | ~200 | ~10 | Small predators, scavengers |\n' +
        '| Top predators (T4) | ~20 | ~1 | Tigers |\n\n' +
        '**Stable isotope analysis** can determine an organism\'s trophic level without observing what it eats. The ratio of 15N to 14N (delta-15N) increases by ~3.4 per mille per trophic level:\n\n' +
        '| Organism | delta-15N (per mille) | Calculated trophic level |\n' +
        '|----------|----------------------|-------------------------|\n' +
        '| Grass | 2.0 | 1.0 (baseline) |\n' +
        '| Deer | 5.4 | 1 + (5.4 - 2)/3.4 = **2.0** |\n' +
        '| Tiger | 12.0 | 1 + (12 - 2)/3.4 = **3.9** |\n\n' +
        'The tiger\'s value of 3.9 means it feeds roughly at the fourth trophic level — it eats herbivores (T2) and sometimes secondary consumers (T3), so its average position is between T3 and T4.',
      advancedContent:
        '**Network analysis** of food webs uses **connectance** (C = L/S², where L = number of links, S = number of species) to characterise web complexity. Most real webs have C approximately 0.1–0.15.\n\n' +
        '| Web property | Formula | Typical value | Meaning |\n' +
        '|-------------|---------|---------------|--------|\n' +
        '| Connectance | C = L/S² | 0.1–0.15 | Fraction of possible links realised |\n' +
        '| Link density | L/S | 2–5 | Average links per species |\n' +
        '| Clustering | — | 0.2–0.4 | How often neighbours are connected |\n\n' +
        '**Keystone species** (Paine, 1969) have disproportionate effects relative to their abundance. Removing sea otters from kelp forests causes urchin populations to explode, destroying the kelp — a **trophic cascade**. Asian elephants function as keystone species in floodplain grasslands: their browsing prevents forest encroachment, maintaining grassland habitat for dozens of other species.\n\n' +
        'The **Lotka-Volterra competition equations** model two competing species:\n\n' +
        'dN1/dt = r1 * N1 * (K1 - N1 - alpha12 * N2) / K1\n\n' +
        'where alpha12 is the competition coefficient. Coexistence requires each species to limit itself more than it limits the other (alpha12 * alpha21 < 1). Modern food web ecology uses **structural equation modelling** and **Bayesian network analysis** to disentangle direct and indirect effects in complex webs with hundreds of species.',
    },

    // ── Section 3: Energy Pyramids and Trophic Efficiency ─────────
    {
      title: 'Energy Pyramids and Trophic Efficiency',
      diagram: 'EnergyPyramidDiagram',
      beginnerContent:
        'If you stack the energy available at each level of a food chain, you get a **pyramid** — wide at the bottom, narrow at the top.\n\n' +
        'Why? Because energy is lost at every step. Plants capture sunlight. Herbivores eat plants but burn most of the energy just staying alive — breathing, moving, keeping warm. Predators eat herbivores but again burn most of the energy. By the time you reach the top predator, only a tiny fraction remains.\n\n' +
        '| Level | Who | Energy available | Lost as heat |\n' +
        '|-------|-----|-----------------|-------------|\n' +
        '| Base | Grass (10,000 kJ) | 100% | — |\n' +
        '| Level 2 | Deer (1,000 kJ) | 10% | 90% |\n' +
        '| Level 3 | Wild dog (100 kJ) | 1% | 99% |\n' +
        '| Level 4 | Tiger (10 kJ) | 0.1% | 99.9% |\n\n' +
        '**Worked example — why there are so few tigers:**\n\n' +
        'A tiger needs about 6,000 kcal per day. Each deer provides roughly 60,000 kcal of meat. So a tiger needs about one deer every 10 days — roughly 36 deer per year. Each deer needs about 5 kg of grass per day — 1,825 kg per year. So one tiger indirectly requires 36 x 1,825 = **65,700 kg of grass per year**. That\'s 65 tonnes of plant growth to support a single tiger.\n\n' +
        '**Try the diagram above** — toggle between energy, biomass, and numbers pyramids to see how each tells a different story.',
      intermediateContent:
        '**Three types of ecological pyramids:**\n\n' +
        '| Pyramid type | What it measures | Always upright? | Exception |\n' +
        '|-------------|-----------------|-----------------|----------|\n' +
        '| **Energy** | kJ/m²/year at each level | Yes, always | None — thermodynamics guarantees it |\n' +
        '| **Biomass** | g/m² standing crop | Usually | Inverted in ocean: phytoplankton biomass < zooplankton biomass because phytoplankton reproduce so fast |\n' +
        '| **Numbers** | Count of individuals | Usually | Inverted for parasites: one tree hosts millions of insects |\n\n' +
        '**Trophic efficiency varies by organism type:**\n\n' +
        '| Organism type | Assimilation efficiency | Production efficiency | Overall trophic efficiency |\n' +
        '|--------------|------------------------|---------------------|-------------------------|\n' +
        '| Endotherms (mammals, birds) | 60–90% | 1–5% | 1–3% |\n' +
        '| Ectotherms (fish, reptiles) | 60–90% | 10–25% | 6–15% |\n' +
        '| Insects | 30–50% | 30–40% | 10–20% |\n\n' +
        'Endotherms are spectacularly wasteful — they burn most assimilated energy maintaining body temperature. This is why aquaculture (raising fish) is far more feed-efficient than cattle ranching: a salmon converts ~15% of feed energy into body mass, while a cow converts only ~3%.',
      advancedContent:
        '**The ecological efficiency cascade:**\n\n' +
        'Total trophic efficiency = Consumption efficiency x Assimilation efficiency x Production efficiency\n\n' +
        '| Efficiency metric | Definition | Typical range |\n' +
        '|------------------|-----------|---------------|\n' +
        '| Consumption (CE) | Ingested / Available | 10–50% |\n' +
        '| Assimilation (AE) | Assimilated / Ingested | 20–90% |\n' +
        '| Production (PE) | New biomass / Assimilated | 1–40% |\n' +
        '| Net (CE x AE x PE) | New biomass / Available | 1–15% |\n\n' +
        'The **Lindeman efficiency** (progressive efficiency = production at Tn / production at Tn-1) was the first quantitative measure of energy transfer between trophic levels (Lindeman, 1942, studying Cedar Bog Lake). His landmark paper was initially rejected — reviewers thought the idea of quantifying ecosystem energy flow was too reductionist. It became one of the most cited papers in ecology.\n\n' +
        '**Ecological footprint calculations** use these efficiencies to estimate the land area required per person. A vegetarian diet requires roughly 0.5 hectares of cropland per person. A meat-heavy diet requires 2–4 hectares — the difference is entirely due to trophic inefficiency: you\'re eating one level higher on the pyramid.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Energy pyramids can sometimes be inverted (wider at the top).', answer: false, explanation: 'Energy pyramids are always upright — the second law of thermodynamics guarantees that energy is lost as heat at each level. Biomass and numbers pyramids can be inverted, but energy pyramids cannot.' },
            { text: 'A salmon farm is more feed-efficient than a cattle ranch.', answer: true, explanation: 'Fish are ectotherms and convert 10-15% of feed to body mass. Cattle are endotherms and convert only 1-3%, burning most energy on maintaining body temperature.' },
            { text: 'Removing top predators has no effect on the levels below them.', answer: false, explanation: 'Removing top predators triggers trophic cascades — herbivore populations explode, overgrazing destroys vegetation, and the entire ecosystem shifts. This has been documented in Yellowstone (wolves), kelp forests (sea otters), and many other systems.' },
          ],
        },
      },
    },

    // ── Section 4: Biomes of the Eastern Himalayas ───────────────
    {
      title: 'Biomes and Habitat Types',
      diagram: 'NEIndiaBiomesDiagram',
      beginnerContent:
        'A **biome** is a large-scale ecosystem type defined by its climate, vegetation, and animal life. Earth has roughly a dozen major biomes, from tundra to tropical rainforest.\n\n' +
        '| Biome | Climate | Key plants | Key animals |\n' +
        '|-------|---------|-----------|------------|\n' +
        '| Tropical rainforest | Hot, wet year-round | Tall canopy trees, epiphytes | Primates, birds, insects |\n' +
        '| Tropical grassland | Hot, wet/dry seasons | Tall grasses, scattered trees | Large grazers, predators |\n' +
        '| Temperate forest | Moderate, seasonal | Deciduous or mixed trees | Deer, bears, songbirds |\n' +
        '| Alpine | Cold, high altitude | Mosses, dwarf shrubs, grasses | Mountain goats, snow leopards |\n' +
        '| Freshwater wetland | Waterlogged soils | Reeds, floating vegetation | Fish, amphibians, water birds |\n\n' +
        'The eastern Himalayan foothills are remarkable because they compress multiple biomes into a short vertical distance:\n\n' +
        '| Altitude | Biome type | What you see |\n' +
        '|----------|-----------|-------------|\n' +
        '| 0–500 m | Tropical floodplain grassland | Elephant grass, rhinos, elephants |\n' +
        '| 500–1,500 m | Subtropical broadleaf forest | Sal, teak, hornbills |\n' +
        '| 1,500–3,000 m | Temperate cloud forest | Oaks, rhododendrons, red pandas |\n' +
        '| 3,000–4,500 m | Alpine meadow | Wildflowers, musk deer |\n' +
        '| 4,500 m+ | Snow and rock | Lichens, snow leopards |\n\n' +
        'You can walk from tropical jungle to alpine tundra in a single day — something possible in very few places on Earth.\n\n' +
        '**Think of it this way:** Biomes are like chapters in a book. Each chapter has its own cast of characters, its own rules, and its own story. But they\'re all part of the same planet.',
      intermediateContent:
        '**Why do biomes form where they do?**\n\n' +
        'Two variables explain most biome distribution: **mean annual temperature** and **mean annual precipitation**.\n\n' +
        '| Biome | Temperature range | Precipitation range |\n' +
        '|-------|------------------|--------------------|\n' +
        '| Tropical rainforest | 20–28 C | > 2,000 mm/yr |\n' +
        '| Tropical savanna | 20–30 C | 500–1,500 mm/yr (seasonal) |\n' +
        '| Temperate forest | 5–20 C | 750–2,000 mm/yr |\n' +
        '| Boreal/taiga | -5–5 C | 400–1,000 mm/yr |\n' +
        '| Desert | Variable | < 250 mm/yr |\n' +
        '| Tundra | -10–0 C | < 250 mm/yr |\n\n' +
        'The Whittaker biome diagram plots these two axes and shows where each biome falls. In mountainous terrain, temperature drops ~6.5 C per 1,000 m of elevation (the **lapse rate**), compressing biome transitions vertically.\n\n' +
        'The Indo-Burma biodiversity hotspot — which includes the eastern Himalayan foothills — has over 13,500 plant species, 1,300 bird species, and 430 mammal species. The extraordinary diversity results from:\n' +
        '- **Elevational compression** of multiple climate zones\n' +
        '- **Monsoon dynamics** delivering 2,000–10,000 mm of annual rainfall\n' +
        '- **Refuge effect** during ice ages (tropical valleys sheltered species that went extinct elsewhere)\n' +
        '- **Tectonic uplift** creating new niches as the Himalayas rose',
      advancedContent:
        '**Island biogeography theory** (MacArthur & Wilson, 1967) applies not just to islands but to any isolated habitat patches — including fragmented forests, mountaintop meadows, and wetlands surrounded by farmland.\n\n' +
        'The species-area relationship: **S = cA^z**\n\n' +
        'where S = number of species, A = area, c and z are constants.\n\n' +
        '| Context | Typical z value | Meaning |\n' +
        '|---------|----------------|--------|\n' +
        '| Islands in an archipelago | 0.25–0.35 | Strong isolation effect |\n' +
        '| Habitat fragments on mainland | 0.15–0.25 | Some dispersal between fragments |\n' +
        '| Within a continuous habitat | 0.10–0.20 | Weak isolation |\n\n' +
        '**Worked example:** If a 1,000 km² forest has 200 bird species and z = 0.25, how many species remain if the forest is reduced to 100 km²?\n\n' +
        'S_new/S_old = (A_new/A_old)^z = (100/1000)^0.25 = 0.1^0.25 = 0.56\n\n' +
        'S_new = 200 x 0.56 = **112 species** — a 44% loss from a 90% reduction in area.\n\n' +
        'This relationship is central to conservation planning: it predicts how many species will be lost as habitat shrinks, and it justifies wildlife corridors that effectively increase the "area" by connecting fragments.',
    },

    // ── Section 5: Population Growth ─────────────────────────────
    {
      title: 'Population Growth — Exponential vs Logistic',
      diagram: 'PopulationGrowthCurve',
      beginnerContent:
        'When a population has unlimited food and space, it grows **exponentially** — each generation is bigger than the last by a constant multiplier.\n\n' +
        '| Generation | Rabbits | Growth |\n' +
        '|-----------|---------|--------|\n' +
        '| Start | 2 | — |\n' +
        '| Gen 1 | 4 | x2 |\n' +
        '| Gen 2 | 8 | x2 |\n' +
        '| Gen 3 | 16 | x2 |\n' +
        '| Gen 4 | 32 | x2 |\n' +
        '| Gen 10 | 2,048 | x2 |\n' +
        '| Gen 20 | 2,097,152 | x2 |\n\n' +
        'The growth curve shoots upward like a hockey stick. But no environment has unlimited resources. Eventually food runs short, disease spreads in crowded conditions, or predators multiply to match the prey.\n\n' +
        'The population hits a ceiling called the **carrying capacity** (K) — the maximum number the environment can sustain. Growth slows and levels off, forming an S-shaped curve called **logistic growth**.\n\n' +
        '**Real example — the sangai deer:**\n\n' +
        'The sangai (brow-antlered deer) of Loktak Lake in Manipur live on floating phumdi islands. With only enough habitat for about 260 deer, that\'s the carrying capacity. Even if the deer reproduce quickly, they can\'t exceed what the phumdis can support — unless habitat is restored.\n\n' +
        '**Think of it this way:** Exponential growth is like filling a jar with rice — one grain, two grains, four grains. At first it looks empty. Then suddenly it\'s half full. One more doubling and it overflows. Logistic growth is what happens when the jar has a lid.',
      intermediateContent:
        '**The mathematics of growth:**\n\n' +
        '| Model | Equation | Key assumption |\n' +
        '|-------|---------|----------------|\n' +
        '| Exponential | dN/dt = rN | Unlimited resources |\n' +
        '| Logistic | dN/dt = rN(1 - N/K) | Growth slows as N approaches K |\n\n' +
        '**Worked example — exponential growth:**\n\n' +
        'A fish population has r = 0.05/year and N0 = 100.\n\n' +
        '| Time (years) | Calculation | Population |\n' +
        '|-------------|------------|------------|\n' +
        '| 0 | 100 | 100 |\n' +
        '| 10 | 100 x e^(0.5) | **165** |\n' +
        '| 20 | 100 x e^(1.0) | **272** |\n' +
        '| 50 | 100 x e^(2.5) | **1,218** |\n' +
        '| 100 | 100 x e^(5.0) | **14,841** |\n\n' +
        'Doubling time = ln(2)/r = 0.693/0.05 = **13.9 years**.\n\n' +
        '**Worked example — logistic growth:**\n\n' +
        'Same population with K = 500. At N = K/2 = 250, growth rate is maximum. The S-curve solution:\n\n' +
        'N(t) = K / (1 + ((K - N0)/N0) x e^(-rt))\n\n' +
        '**r-selected vs K-selected species:**\n\n' +
        '| Trait | r-selected | K-selected |\n' +
        '|-------|-----------|------------|\n' +
        '| Body size | Small | Large |\n' +
        '| Offspring | Many, no parental care | Few, heavy parental care |\n' +
        '| Lifespan | Short | Long |\n' +
        '| Growth rate (r) | High | Low |\n' +
        '| Population pattern | Boom-bust cycles | Stable near K |\n' +
        '| Examples | Mosquitoes, bacteria, weeds | Elephants, tigers, whales |',
      advancedContent:
        '**The Lotka-Volterra predator-prey model:**\n\n' +
        'dN/dt = rN - aNP (prey)\n' +
        'dP/dt = baNP - mP (predator)\n\n' +
        'where a = attack rate, b = conversion efficiency, m = predator death rate.\n\n' +
        '| Parameter | Meaning | Typical values |\n' +
        '|-----------|---------|---------------|\n' +
        '| r | Prey intrinsic growth rate | 0.5–2.0/year |\n' +
        '| a | Attack rate (predator efficiency) | 0.001–0.1 |\n' +
        '| b | Conversion efficiency (prey eaten → predator born) | 0.01–0.1 |\n' +
        '| m | Predator death rate | 0.1–0.5/year |\n\n' +
        'Solutions are neutrally stable cycles — predator and prey populations oscillate with the predator lagging behind. Adding density dependence to prey: dN/dt = rN(1 - N/K) - aNP produces **damped oscillations** converging to a stable equilibrium.\n\n' +
        'Real populations show more complex dynamics: the **Ricker model** N(t+1) = N(t) x e^(r(1 - N(t)/K)) exhibits period-doubling cascades leading to **deterministic chaos** when r > 2.69 — identical mathematical behaviour to the logistic map, one of the foundational discoveries of chaos theory (May, 1976).\n\n' +
        'Conservation biologists use **population viability analysis** (PVA) with stochastic simulations to estimate extinction probability. For the sangai deer, models suggest habitat restoration increasing K from 260 to 500 would reduce 50-year extinction probability from ~30% to below 5%.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each population concept to its definition',
          pairs: [
            ['Carrying capacity (K)', 'Maximum population size the environment can sustain indefinitely'],
            ['Intrinsic growth rate (r)', 'Per-capita birth rate minus death rate under ideal conditions'],
            ['Doubling time', 'Time for a population to double: ln(2)/r'],
            ['Logistic growth', 'S-shaped curve where growth slows as population approaches K'],
          ],
        },
      },
    },

    // ── Section 6: Carrying Capacity and Minimum Viable Populations ────
    {
      title: 'Carrying Capacity and Why It Matters',
      diagram: 'LoktakSangaiDiagram',
      beginnerContent:
        'Carrying capacity isn\'t fixed — it changes when the environment changes.\n\n' +
        '| What happens | Effect on carrying capacity |\n' +
        '|-------------|---------------------------|\n' +
        '| Wetland is drained for farming | K drops — less habitat |\n' +
        '| Dam alters water levels | K drops — floating islands thin |\n' +
        '| Forest corridor is restored | K rises — animals can spread |\n' +
        '| Invasive species arrives | K drops — competition for food |\n' +
        '| Climate change shifts rainfall | K may rise or fall |\n\n' +
        'Below a certain population size, survival becomes a gamble. This threshold is called the **minimum viable population** (MVP). Below it:\n\n' +
        '- **Inbreeding** weakens offspring (less genetic diversity)\n' +
        '- **Random events** (storms, disease) can wipe everyone out\n' +
        '- **Finding mates** becomes difficult\n\n' +
        'For most large mammals, the MVP is 500–5,000 individuals.\n\n' +
        '**Real example — Loktak Lake:**\n\n' +
        'When the Ithai Barrage was built in 1983, it raised Loktak Lake\'s water level. The phumdi islands thinned and sank. Sangai deer habitat shrank. The carrying capacity dropped, and the population fell to fewer than 100 animals. Only intensive conservation brought it back to around 260 — still dangerously close to the edge.\n\n' +
        'This is why conservationists don\'t just count animals — they manage **habitat** to raise the carrying capacity.',
      intermediateContent:
        '**Limiting factors and Liebig\'s law:**\n\n' +
        'Carrying capacity is set by whichever resource is in shortest supply relative to demand — the **limiting factor** (Liebig\'s law of the minimum).\n\n' +
        '| Species | Limiting factor | How K is estimated |\n' +
        '|---------|----------------|-------------------|\n' +
        '| Sangai deer | Phumdi area | ~0.5 km² per deer, 130 km² phumdi = K ~ 260 |\n' +
        '| Bengal tiger | Prey density | ~50 large prey per tiger per year |\n' +
        '| Asian elephant | Browse area + water | ~5–10 km² per elephant |\n' +
        '| Hilsa fish | Spawning habitat | Upstream river access, water quality |\n\n' +
        '**The 50/500 rule** (Franklin, 1980):\n' +
        '- **50 individuals** to avoid short-term inbreeding depression\n' +
        '- **500 individuals** to maintain long-term evolutionary potential\n\n' +
        'More refined models use **effective population size** (Ne), which is always lower than census count:\n\n' +
        'Ne = 4 x Nf x Nm / (Nf + Nm)\n\n' +
        '**Worked example:** If 260 sangai include 90 males and 170 females:\n\n' +
        'Ne = 4 x 170 x 90 / (170 + 90) = 61,200 / 260 = **235**\n\n' +
        'The effective population is 235, not 260 — and 235 is below the 500 threshold for long-term genetic health. This is why genetic management (translocations, captive breeding) becomes critical.',
      advancedContent:
        '**The Allee effect — when small populations spiral downward:**\n\n' +
        'Most population models assume that per-capita growth rate increases at low density (less competition). The **Allee effect** is the opposite: growth rate *decreases* at low density.\n\n' +
        '| Cause of Allee effect | Mechanism | Example |\n' +
        '|----------------------|-----------|--------|\n' +
        '| Mate finding | Fewer individuals = harder to find partners | Scattered whale populations |\n' +
        '| Cooperative defence | Herds deter predators; lone animals are vulnerable | Musk oxen, schooling fish |\n' +
        '| Genetic diversity | Small populations → inbreeding → reduced fitness | Island populations |\n' +
        '| Pollination failure | Few plants → pollinators don\'t visit → no seeds | Rare orchids |\n\n' +
        'Mathematically: dN/dt = rN(N/A - 1)(1 - N/K), where A is the Allee threshold. Below A, growth becomes negative and the population spirals to extinction without intervention.\n\n' +
        '**Metapopulation theory** (Levins, 1969) models multiple sub-populations connected by dispersal:\n\n' +
        'dp/dt = cp(1 - p) - ep\n\n' +
        'where p = fraction of occupied patches, c = colonisation rate, e = extinction rate. At equilibrium: p* = 1 - e/c.\n\n' +
        'This framework guides **corridor design**: connecting habitat fragments increases c, raising equilibrium occupancy. Conservation genetics now uses **genomic sequencing** to measure inbreeding coefficients, identify adaptive alleles, and guide genetic rescue — transferring individuals between populations to restore diversity.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'The sangai deer was thought to be extinct until 1953, when six individuals were rediscovered on floating phumdi islands in Loktak Lake. Today the population is around 260.',
            'Cheetahs passed through such a severe genetic bottleneck ~10,000 years ago that all living cheetahs are as genetically similar as identical twins. Their lack of genetic diversity makes them extremely vulnerable to disease.',
            'The Kakapo parrot of New Zealand had a population of just 51 in 1995. Every single bird was named and individually tracked. As of 2024, the population has risen to 247 — each one still has a name.',
            'The concept of minimum viable population was tested dramatically with the Florida panther: by the 1990s, only 20-30 remained, and inbreeding caused heart defects and low fertility. Eight female Texas pumas were introduced in 1995, and the population recovered to over 200.',
          ],
        },
      },
    },

    // ── Section 7: Grassland Ecology and Fire ────────────────────
    {
      title: 'Grassland Ecology and Fire Dynamics',
      diagram: 'GrassFireCycleDiagram',
      beginnerContent:
        'Grasslands are not failed forests. They are a distinct biome maintained by three forces: **fire**, **grazing**, and **climate**. Remove any one and the grassland changes — often into something less biodiverse.\n\n' +
        '| Force | What it does | What happens without it |\n' +
        '|-------|-------------|------------------------|\n' +
        '| **Fire** | Burns woody plants, recycles nutrients | Trees invade, grass is shaded out |\n' +
        '| **Grazing** | Keeps grass short, opens gaps for seedlings | Thick dead thatch smothers new growth |\n' +
        '| **Dry season** | Kills back top growth, favours deep-rooted grasses | Forests encroach in permanently wet areas |\n\n' +
        'Kaziranga\'s famous tall elephant grass (reaching 6 metres) depends on an annual cycle:\n\n' +
        '1. **Monsoon** (June–September): Heavy rain floods the plains. Grass grows explosively.\n' +
        '2. **Post-monsoon** (October–January): Water recedes. Grass dries into standing hay.\n' +
        '3. **Controlled burn** (January–March): Park managers set fires. Dead grass burns; roots survive underground.\n' +
        '4. **Regrowth** (March–May): Fresh green shoots emerge from the roots. Rhinos, deer, and buffalo feast on the nutritious new growth.\n\n' +
        'Without controlled burns, dead grass accumulates, woody plants creep in, and the grassland slowly becomes forest — habitat that rhinos and swamp deer cannot use.\n\n' +
        '**Think of it this way:** Fire in a grassland is like pruning a garden. It looks destructive, but it\'s essential for healthy new growth.',
      intermediateContent:
        '**Fire ecology — the science of controlled burning:**\n\n' +
        '| Fire variable | Effect on ecosystem | Management goal |\n' +
        '|-------------|--------------------|-----------------|\n' +
        '| **Frequency** | Annual burns favour grasses; infrequent burns allow shrubs | Match natural fire return interval |\n' +
        '| **Intensity** | Hot fires kill tree saplings; cool fires only remove litter | Moderate — clear dead growth without scorching soil |\n' +
        '| **Season** | Early dry season = cooler, patchier; late = hotter, more complete | Stagger timing for habitat mosaic |\n' +
        '| **Patchiness** | Unburned refuges let animals shelter | Never burn entire area at once |\n\n' +
        'Grassland soils store enormous amounts of carbon — more than forests in many cases, because the carbon is underground in root systems rather than in above-ground wood. A healthy grassland soil horizon can contain 200–300 tonnes of carbon per hectare in the top metre.\n\n' +
        '**Grass-grazer coevolution:**\n\n' +
        'Grasses evolved several adaptations specifically in response to grazing:\n\n' +
        '| Adaptation | How it works | Benefit |\n' +
        '|-----------|-------------|--------|\n' +
        '| Basal meristem | Growth point is at ground level, not the tip | Survives being eaten from the top |\n' +
        '| Silica in leaves | Microscopic glass crystals wear down teeth | Deters over-grazing |\n' +
        '| Tillering | Cut grass sends out multiple new shoots | Becomes denser after grazing |\n' +
        '| Deep roots | Root system extends 2–4 metres underground | Survives fire and drought |',
      advancedContent:
        '**Fire regime modelling:**\n\n' +
        'The probability of fire in a given year depends on fuel load (F), moisture (M), and ignition (I):\n\n' +
        'P(fire) = f(F) x g(M) x h(I)\n\n' +
        'where f increases with fuel load, g decreases with moisture, and h represents ignition probability (lightning, human).\n\n' +
        '**State-and-transition models** describe how grasslands shift between alternative stable states:\n\n' +
        '| State | Drivers | Transition to |\n' +
        '|-------|---------|---------------|\n' +
        '| Open grassland | Regular fire + grazing | → Shrubland if fire excluded |\n' +
        '| Shrubland | Fire suppression + reduced grazing | → Forest if continued |\n' +
        '| Forest | No fire, high rainfall | → Grassland only with major disturbance |\n\n' +
        'These transitions can be **irreversible** on management timescales. Once woody plants establish deep root systems, reintroducing fire alone may not restore the grassland — the shrubs resprout from protected root crowns. This hysteresis effect means that preventing forest encroachment is far easier than reversing it.\n\n' +
        'Remote sensing using **MODIS and Sentinel-2** satellite imagery tracks fire frequency, burned area, and vegetation recovery across seasons. NDVI time series reveal post-fire green-up curves that quantify ecosystem recovery rate — Kaziranga\'s grasslands typically return to pre-burn NDVI within 6–8 weeks.',
    },

    // ── Section 8: Biodiversity ──────────────────────────────────
    {
      title: 'Biodiversity — Why Variety Matters',
      diagram: 'BeeEcosystemServiceDiagram',
      beginnerContent:
        'Biodiversity is the variety of life in an ecosystem — how many different species live there, how genetically varied each species is, and how many different habitat types exist.\n\n' +
        '| Type of biodiversity | What it measures | Why it matters |\n' +
        '|---------------------|-----------------|---------------|\n' +
        '| **Species diversity** | Number of different species | More species = more ecosystem functions |\n' +
        '| **Genetic diversity** | Variation within a species | More genetic variety = better adaptation to change |\n' +
        '| **Ecosystem diversity** | Variety of habitats | More habitat types = more niches for species |\n\n' +
        'High biodiversity makes ecosystems more **resilient**. If one pollinator species disappears, others can fill the gap. If one crop variety fails, others with different disease resistance survive.\n\n' +
        'The Indo-Burma biodiversity hotspot (which includes the eastern Himalayan foothills) holds more plant species than all of Europe. Earth has 36 recognised biodiversity hotspots — regions with extraordinary species richness that are also under threat. To qualify, a hotspot must:\n' +
        '- Contain at least **1,500 endemic plant species** (found nowhere else)\n' +
        '- Have lost at least **70% of its original habitat**\n\n' +
        '| Hotspot | Endemic plants | Species under threat |\n' +
        '|---------|---------------|---------------------|\n' +
        '| Indo-Burma | 7,000+ | One-horned rhino, hoolock gibbon |\n' +
        '| Western Ghats | 5,000+ | Lion-tailed macaque, Nilgiri tahr |\n' +
        '| Sundaland (SE Asia) | 15,000+ | Orangutan, Sumatran tiger |\n' +
        '| Madagascar | 11,600+ | Lemurs (100+ species) |\n\n' +
        '**Think of it this way:** Losing biodiversity is like removing rivets from an aeroplane wing. Lose one, nothing happens. Lose ten, probably fine. But at some point — which you can\'t predict in advance — the wing falls off.',
      intermediateContent:
        '**Measuring biodiversity — the Shannon Index:**\n\n' +
        'Species richness (just counting species) is crude — it doesn\'t account for **evenness**. A forest with 100 species where one species makes up 90% of individuals is less diverse than one where all 100 species are equally common.\n\n' +
        'The **Shannon diversity index**: H\' = -SUM(pi x ln(pi))\n\n' +
        'where pi is the proportion of individuals belonging to species i.\n\n' +
        '**Worked example — two forests compared:**\n\n' +
        '| Species | Forest A (count) | Forest A (pi) | Forest B (count) | Forest B (pi) |\n' +
        '|---------|-----------------|---------------|-----------------|---------------|\n' +
        '| Oak | 90 | 0.90 | 35 | 0.35 |\n' +
        '| Maple | 5 | 0.05 | 30 | 0.30 |\n' +
        '| Birch | 3 | 0.03 | 20 | 0.20 |\n' +
        '| Pine | 2 | 0.02 | 15 | 0.15 |\n' +
        '| **Total** | **100** | | **100** | |\n\n' +
        'Forest A: H\' = -(0.9 x ln(0.9) + 0.05 x ln(0.05) + 0.03 x ln(0.03) + 0.02 x ln(0.02))\n' +
        'H\' = -(−0.095 + −0.150 + −0.105 + −0.078) = **0.43**\n\n' +
        'Forest B: H\' = -(0.35 x ln(0.35) + 0.30 x ln(0.30) + 0.20 x ln(0.20) + 0.15 x ln(0.15))\n' +
        'H\' = -(−0.367 + −0.361 + −0.322 + −0.285) = **1.34**\n\n' +
        'Forest B is over 3x more diverse despite having the same number of species — because its individuals are more evenly distributed.',
      advancedContent:
        '**The biodiversity-ecosystem function relationship:**\n\n' +
        'Tilman\'s grassland experiments (Cedar Creek, Minnesota) showed that plots with more species:\n' +
        '- Produce more biomass\n' +
        '- Are more stable year-to-year\n' +
        '- Resist invasive species better\n' +
        '- Recover faster from drought\n\n' +
        '| Number of species | Biomass (g/m²) | Year-to-year CV |\n' +
        '|------------------|---------------|----------------|\n' +
        '| 1 | 100 | 45% |\n' +
        '| 4 | 200 | 30% |\n' +
        '| 8 | 280 | 20% |\n' +
        '| 16 | 350 | 12% |\n\n' +
        'Two mechanisms explain this:\n' +
        '- **Complementarity**: Different species use different resources (deep vs shallow roots, different light requirements), so more species = more total resource use\n' +
        '- **Sampling effect**: More species = higher probability of including a highly productive species\n\n' +
        'The **insurance hypothesis** (Yachi & Loreau, 1999): biodiversity insures against environmental fluctuations. If species respond differently to drought, flood, or temperature extremes, then a diverse community will always contain some species that perform well under current conditions — reducing variance in ecosystem function.\n\n' +
        'Current extinction rates are estimated at 100–1,000x the background rate of ~0.1 extinctions per million species-years. The IUCN Red List classifies species by threat level: there are currently ~44,000 species classified as threatened with extinction.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each ecosystem service to its category',
          pairs: [
            ['Pollination by bees', 'Supporting service — enables plant reproduction'],
            ['Flood control by wetlands', 'Regulating service — moderates natural hazards'],
            ['Timber and fish harvest', 'Provisioning service — direct products from nature'],
            ['Recreational hiking and tourism', 'Cultural service — non-material human benefit'],
          ],
        },
      },
    },

    // ── Section 9: Conservation Strategies ───────────────────────
    {
      title: 'Conservation Strategies',
      diagram: 'GrassRhinoHabitatDiagram',
      beginnerContent:
        'Conservation isn\'t just about saving charismatic animals. It\'s about maintaining the **ecosystem services** that all life — including humans — depends on.\n\n' +
        '| Ecosystem service | What nature provides | Example |\n' +
        '|-------------------|---------------------|--------|\n' +
        '| **Pollination** | Bees and butterflies pollinate crops | 75% of food crops depend on pollinators |\n' +
        '| **Water purification** | Wetlands filter sediment and pollutants | Loktak Lake filters water for surrounding communities |\n' +
        '| **Flood control** | Floodplains absorb excess water | Brahmaputra wetlands reduce downstream flooding |\n' +
        '| **Carbon storage** | Forests and soils absorb CO2 | One hectare of tropical forest stores 150–200 tonnes of carbon |\n' +
        '| **Soil fertility** | Decomposers recycle nutrients | Earthworms process 100 tonnes of soil per hectare per year |\n\n' +
        'Three complementary strategies protect these services:\n\n' +
        '| Strategy | How it works | Example |\n' +
        '|---------|-------------|--------|\n' +
        '| **Protected areas** | Set aside core habitat from development | Keibul Lamjao National Park (sangai deer) |\n' +
        '| **Wildlife corridors** | Connect fragmented habitats | Elephant corridors in the Brahmaputra valley |\n' +
        '| **Community conservation** | Local people participate in management | Anti-poaching patrols by village volunteers in Kaziranga |\n\n' +
        'The most effective conservation combines all three: protect core habitat, connect it with corridors, and involve communities in stewardship. Fences alone have never saved a species long-term.',
      intermediateContent:
        '**The IUCN Red List — how we track species at risk:**\n\n' +
        '| Category | Criteria | Examples |\n' +
        '|----------|---------|----------|\n' +
        '| **Extinct (EX)** | No individuals remain anywhere | Dodo, passenger pigeon |\n' +
        '| **Critically Endangered (CR)** | Extremely high extinction risk | Sumatran rhino (~80 left) |\n' +
        '| **Endangered (EN)** | Very high extinction risk | One-horned rhino (~4,000), tiger (~4,500) |\n' +
        '| **Vulnerable (VU)** | High extinction risk | Asian elephant (~50,000) |\n' +
        '| **Near Threatened (NT)** | Close to qualifying for threatened | Hilsa fish (declining populations) |\n' +
        '| **Least Concern (LC)** | Not at significant risk | House sparrow, common crow |\n\n' +
        '**How conservation actually works — the one-horned rhino:**\n\n' +
        'In 1905, there were fewer than 20 one-horned rhinos in Kaziranga. Today there are over 2,600. What worked:\n\n' +
        '| Decade | Action | Result |\n' +
        '|--------|--------|--------|\n' +
        '| 1900s | Declared a reserve forest | Stopped habitat clearing |\n' +
        '| 1950s | Anti-poaching patrols established | Reduced hunting |\n' +
        '| 1970s | Declared a national park | Stronger legal protection |\n' +
        '| 1985 | UNESCO World Heritage Site | International recognition and funding |\n' +
        '| 2000s+ | Translocations to other parks | Spread risk across multiple populations |\n\n' +
        'This is a century-long project. Conservation is not a sprint — it\'s a relay race across generations.',
      advancedContent:
        '**Systematic conservation planning:**\n\n' +
        'Modern conservation uses algorithms to maximise species protection per dollar spent. The key framework is **complementarity-based reserve selection** (Margules & Pressey, 2000):\n\n' +
        '1. Map all species distributions\n' +
        '2. Set **representation targets** (e.g., protect at least 30% of each species\' range)\n' +
        '3. Use optimisation algorithms (e.g., **Marxan** software) to find the minimum-cost set of areas that meets all targets\n\n' +
        '**Conservation prioritisation frameworks:**\n\n' +
        '| Framework | Prioritises by | Used by |\n' +
        '|-----------|---------------|--------|\n' +
        '| Hotspots | Species endemism + habitat loss | Conservation International |\n' +
        '| Global 200 | Ecoregion representation | WWF |\n' +
        '| Alliance for Zero Extinction | Sites with last populations of CR/EN species | AZE |\n' +
        '| Key Biodiversity Areas | Irreplaceability + vulnerability | IUCN |\n\n' +
        '**Debt-for-nature swaps** convert developing-country debt into conservation funding. **REDD+** (Reducing Emissions from Deforestation and forest Degradation) pays countries to keep forests standing by valuing their carbon storage.\n\n' +
        'The **30x30 target** (Kunming-Montreal Global Biodiversity Framework, 2022) aims to protect 30% of Earth\'s land and ocean by 2030. As of 2024, approximately 17% of land and 8% of oceans are protected — ambitious expansion is needed.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A population can grow exponentially forever.', answer: false, explanation: 'Exponential growth requires unlimited resources, which never exist in nature. Eventually, carrying capacity limits growth.' },
            { text: 'Removing one species from an ecosystem can affect species it never directly interacts with.', answer: true, explanation: 'Indirect effects ripple through food webs. Removing wolves from Yellowstone caused elk overpopulation, which destroyed riverside vegetation, which caused river erosion. The wolves never touched a river.' },
            { text: 'The most biodiverse ecosystems are always the largest ones.', answer: false, explanation: 'Small tropical islands and coral reefs can have extraordinary biodiversity. The Indo-Burma hotspot is highly biodiverse despite being geographically small. Diversity depends on climate, habitat variety, and evolutionary history — not just area.' },
            { text: 'Controlled burning damages grassland ecosystems.', answer: false, explanation: 'Controlled burns are essential for grassland health. They remove dead thatch, recycle nutrients, prevent woody plant encroachment, and stimulate nutritious new growth. Suppressing fire is what damages grasslands.' },
          ],
        },
      },
    },

    // ── Section 10: Elephant Corridors and Habitat Connectivity ──
    {
      title: 'Wildlife Corridors and Habitat Connectivity',
      diagram: 'ElephantEcosystemDiagram',
      beginnerContent:
        'Animals don\'t stay inside park boundaries. Elephants roam 15–30 km per day searching for food and water. Tigers patrol territories of 50–100 km². Migratory birds fly thousands of kilometres. If their paths are blocked by roads, farms, or cities, populations become **fragmented** — trapped in small patches that can\'t sustain them.\n\n' +
        '**Wildlife corridors** are strips of habitat that connect isolated patches, allowing animals to move between them.\n\n' +
        '| Corridor type | Width | What moves through | Example |\n' +
        '|-------------|-------|-------------------|--------|\n' +
        '| **Landscape corridor** | 1–10 km | Large mammals, birds | Elephant corridors between Kaziranga and Karbi hills |\n' +
        '| **Stepping stones** | Scattered patches | Flying species, seed dispersers | Patches of forest between wetlands |\n' +
        '| **Riparian buffer** | 50–200 m along rivers | Fish, otters, riparian birds | Vegetated banks along the Brahmaputra |\n' +
        '| **Underpass/overpass** | 10–50 m | Road-crossing mammals | Highway underpasses on National Highway 37 |\n\n' +
        'Without corridors, a population of 200 elephants in one forest and 300 in another function as two separate populations — each more vulnerable to inbreeding and local extinction than a single connected population of 500.\n\n' +
        '**Think of it this way:** Corridors are highways for wildlife. Block the highway and the towns on either side wither.',
      intermediateContent:
        '**Graph theory and landscape connectivity:**\n\n' +
        'Ecologists model habitat connectivity as a **network (graph)** where:\n' +
        '- **Nodes** = habitat patches\n' +
        '- **Edges** = corridors or dispersal routes\n' +
        '- **Edge weight** = ease of movement (inversely proportional to resistance)\n\n' +
        '**Resistance surfaces** map how difficult it is for an animal to cross different land types:\n\n' +
        '| Land cover | Resistance value | Why |\n' +
        '|-----------|-----------------|-----|\n' +
        '| Dense forest | 1 (low) | Preferred habitat, easy movement |\n' +
        '| Open grassland | 2 | Exposed but passable |\n' +
        '| Tea plantation | 5 | Some cover but human activity |\n' +
        '| Agricultural field | 8 | Open, often fenced, crop raiding conflict |\n' +
        '| Village/town | 15 | High human density, danger |\n' +
        '| Highway | 20 (high) | Traffic mortality, noise, barriers |\n\n' +
        '**Circuit theory** (McRae, 2006) models animal movement as electrical current flowing through a resistance landscape. High-current areas are the most important corridors — even if they\'re not obvious on a map. This approach identified that a narrow strip of forest between Kaziranga and the Karbi Anglong hills carries disproportionate elephant movement — losing it would effectively cut the population in two.\n\n' +
        'The Brahmaputra valley has 16 identified elephant corridors connecting protected areas. As of recent surveys, 8 are functional, 5 are partially blocked, and 3 are effectively severed.',
      advancedContent:
        '**Metapopulation dynamics in fragmented landscapes:**\n\n' +
        'The **incidence function model** (Hanski, 1994) predicts patch occupancy:\n\n' +
        'J_i = 1 / (1 + (e_i / A_i^x)² / S_i²)\n\n' +
        'where A_i = patch area, S_i = connectivity (sum of dispersal probabilities from all occupied patches), and e_i and x are species-specific parameters.\n\n' +
        '| Patch property | Effect on occupancy | Management implication |\n' +
        '|---------------|--------------------|-----------------------|\n' +
        '| Large area | Higher occupancy (lower extinction rate) | Protect large core areas |\n' +
        '| High connectivity | Higher occupancy (higher colonisation rate) | Maintain corridors |\n' +
        '| Central position in network | Critical for network-wide connectivity | Prioritise for protection |\n' +
        '| Edge effects (high perimeter:area) | Lower habitat quality at edges | Prefer compact shapes |\n\n' +
        '**Genomic approaches** now complement landscape ecology. By genotyping individuals across a landscape, researchers can measure **gene flow** between patches and identify genetic clusters that reveal barriers to movement — even ones not visible on land-cover maps.\n\n' +
        '**Landscape genetics** combines resistance surface modelling with population genetics to test which landscape features actually impede gene flow. For Asian elephants, studies show that roads and railways are stronger barriers than rivers — elephants swim readily but avoid traffic.',
    },

    // ── Section 11: Fisheries and Population Decline ─────────────
    {
      title: 'Fisheries and Population Decline',
      diagram: 'HilsaPopulationDiagram',
      beginnerContent:
        'Fish populations follow the same ecological rules as any other species — but humans harvest them at industrial scale, creating unique pressures.\n\n' +
        '**Maximum Sustainable Yield (MSY)** is the largest catch that can be taken year after year without causing the population to decline. Take less than MSY and you\'re leaving fish in the water. Take more and the population shrinks — eventually collapsing.\n\n' +
        '| Harvest level | What happens |\n' +
        '|-------------|-------------|\n' +
        '| Well below MSY | Population healthy, catch could be larger |\n' +
        '| At MSY | Maximum catch, population stable |\n' +
        '| Above MSY | Population declining year by year |\n' +
        '| Far above MSY | Population crashes — fishery collapses |\n\n' +
        '**Real example — the hilsa fish:**\n\n' +
        'Hilsa (ilish) is the most economically important fish in the Brahmaputra-Ganges river system. It migrates from the sea upstream to spawn in fresh water. Three threats are pushing it toward decline:\n\n' +
        '| Threat | How it works |\n' +
        '|--------|------------|\n' +
        '| **Overfishing** | Catching fish before they can reproduce |\n' +
        '| **Dams and barrages** | Block migration routes to spawning grounds |\n' +
        '| **Pollution** | Degrades water quality at spawning sites |\n\n' +
        'Bangladesh banned hilsa fishing during peak spawning season and saw a 60% increase in catch within five years — proof that giving fish time to breed works.',
      intermediateContent:
        '**The Schaefer model of fishery dynamics:**\n\n' +
        'Population growth under harvesting: dN/dt = rN(1 - N/K) - H\n\n' +
        'where H = harvest rate. **MSY = rK/4** — half the carrying capacity.\n\n' +
        '**Worked example — hilsa fishery:**\n\n' +
        'If K = 10,000 tonnes (biomass) and r = 0.4/year:\n\n' +
        '| Parameter | Value |\n' +
        '|-----------|-------|\n' +
        '| MSY | 0.4 x 10,000 / 4 = **1,000 tonnes/year** |\n' +
        '| N at MSY | K/2 = **5,000 tonnes** |\n' +
        '| Harvest rate at MSY | H/N = 1,000/5,000 = **0.2/year** (20% per year) |\n\n' +
        'If actual harvest is 1,500 tonnes/year (50% above MSY):\n\n' +
        'dN/dt = 0.4 x 5000 x (1 - 5000/10000) - 1500 = 1000 - 1500 = **-500 tonnes/year**\n\n' +
        'The population declines by 500 tonnes each year. Within a decade, it will crash below the point where recovery is possible.\n\n' +
        '**Age-structured harvesting matters:**\n\n' +
        '| Strategy | Effect | Sustainability |\n' +
        '|----------|--------|---------------|\n' +
        '| Catch all sizes | Removes juveniles before they breed | Unsustainable |\n' +
        '| Minimum size limit | Lets fish breed at least once | Better |\n' +
        '| Seasonal closure | Protects spawning aggregations | Best (combined with size limits) |\n' +
        '| Marine protected areas | Creates permanent refugia | Long-term recovery |',
      advancedContent:
        '**Beyond MSY — modern fisheries science:**\n\n' +
        'MSY has been criticised for being too simplistic. Modern approaches use:\n\n' +
        '| Approach | Improvement over MSY | Challenge |\n' +
        '|---------|---------------------|----------|\n' +
        '| **MEY** (Maximum Economic Yield) | Maximises profit, not tonnage — typically at lower harvest | Requires economic data |\n' +
        '| **Reference points** (B_MSY, F_MSY) | Triggers management action before crisis | Stock assessment uncertainty |\n' +
        '| **Ecosystem-based management** | Considers predator-prey, bycatch, habitat | Data-intensive |\n' +
        '| **Individual Transferable Quotas** | Market-based allocation prevents race-to-fish | Equity concerns |\n\n' +
        '**Stock-recruitment relationships** (Beverton-Holt and Ricker models) describe how spawning biomass relates to recruitment:\n\n' +
        'Beverton-Holt: R = aS / (1 + bS) — recruitment saturates at high spawning stock\n' +
        'Ricker: R = aS x e^(-bS) — recruitment declines at very high spawning stock (overcrowding)\n\n' +
        'For anadromous fish like hilsa, **dam passage** is critical. Fish ladders typically have passage efficiencies of 50–90% per dam. For a fish that must pass 3 dams with 70% efficiency each: overall passage = 0.7³ = **34%** — two-thirds of migrating fish fail to reach spawning grounds. This compounds with overfishing to create a double threat: fewer adults surviving to breed AND fewer of those adults reaching spawning habitat.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'The global fishing fleet is estimated to be 2-3 times larger than what the oceans can sustainably support. Over a third of fish stocks are overfished.',
            'Atlantic cod off Newfoundland collapsed from 800,000 tonnes to near zero in the early 1990s. Despite a fishing ban since 1992, the population has still not recovered — over 30 years later.',
            'Bangladesh\'s hilsa conservation programme — banning fishing during spawning season and compensating fishers with rice — increased hilsa production by over 60% in five years, becoming a global model for sustainable fisheries.',
            'Whale sharks, the largest fish on Earth, were only discovered to give live birth in 1995. A single pregnant female was found carrying 304 embryos at different developmental stages.',
          ],
        },
      },
    },

    // ── Section 12: Signal Detection Theory ──────────────────────
    {
      title: 'Signal Detection in Ecology',
      beginnerContent:
        'Imagine you are a wildlife ranger listening through headphones connected to an acoustic sensor. Your task: detect a poacher\'s gunshot against a background of forest noise — branches cracking, animals calling, thunder rumbling.\n\n' +
        'Four outcomes are possible:\n\n' +
        '| | Signal present (gunshot) | Signal absent (just noise) |\n' +
        '|---|---|---|\n' +
        '| **You say "yes"** | Hit (correct detection) | False alarm (wasted response) |\n' +
        '| **You say "no"** | Miss (poacher escapes) | Correct rejection (all quiet) |\n\n' +
        '**Signal Detection Theory** (SDT) is a mathematical framework for exactly this kind of decision-making. It applies whenever someone — or something — must decide whether a signal is present or absent in the presence of uncertainty.\n\n' +
        '| Application | Signal | Noise |\n' +
        '|------------|--------|-------|\n' +
        '| Anti-poaching acoustics | Gunshot | Forest sounds |\n' +
        '| Medical X-ray | Tumour shadow | Normal tissue |\n' +
        '| Camera trap classification | Tiger image | Large dog or deer image |\n' +
        '| Radar | Aircraft | Flock of birds |\n\n' +
        'SDT separates two independent factors:\n' +
        '- **Sensitivity (d\')**: How well you can actually distinguish signal from noise. A sharp-eared ranger with good equipment has high d\'.\n' +
        '- **Response bias (criterion)**: Your willingness to say "yes." A cautious ranger who only reports definite gunshots has a strict criterion. One who reports every suspicious sound has a liberal criterion.\n\n' +
        'The **ROC curve** plots hit rate against false alarm rate as the criterion varies. A perfect detector hugs the top-left corner; pure guessing falls on the diagonal. The area under the ROC curve (AUC) summarises overall detection: AUC = 1.0 is perfect, AUC = 0.5 is chance.',
      intermediateContent:
        'In SDT, both noise-alone and signal-plus-noise produce Gaussian distributions of sensory evidence.\n\n' +
        '**d\' = (mu_signal - mu_noise) / sigma**\n\n' +
        '| d\' value | Detection quality | Example |\n' +
        '|----------|------------------|--------|\n' +
        '| 0 | No detection ability | Broken sensor |\n' +
        '| 1 | Poor | Camera trap in dense fog |\n' +
        '| 2 | Moderate | Trained ranger with basic equipment |\n' +
        '| 3 | Excellent | Acoustic sensor with noise cancellation |\n' +
        '| 4+ | Near perfect | Laboratory conditions |\n\n' +
        'The **criterion** c = -0.5 x (z(hit rate) + z(false alarm rate)), where z is the inverse normal CDF.\n\n' +
        '**The base rate fallacy — SDT\'s most important practical lesson:**\n\n' +
        'A camera trap AI system has 95% sensitivity and 99% specificity for detecting tigers. Sounds excellent. But if only 1% of images actually contain a tiger:\n\n' +
        '| | Tiger present (1%) | Tiger absent (99%) |\n' +
        '|---|---|---|\n' +
        '| AI says "tiger" | 0.01 x 0.95 = 0.0095 | 0.99 x 0.01 = 0.0099 |\n' +
        '| AI says "no tiger" | 0.01 x 0.05 = 0.0005 | 0.99 x 0.99 = 0.9801 |\n\n' +
        'Positive predictive value = 0.0095 / (0.0095 + 0.0099) = **49%**\n\n' +
        'Half of all "tiger detected" alerts are false alarms. This counterintuitive result occurs because the rare event (tiger) is overwhelmed by the common event (no tiger) — even with a 99% specific test.',
      advancedContent:
        'The ROC curve for Gaussian equal-variance SDT is parameterised by:\n\n' +
        'Hit rate = Phi(d\'/2 - c) and False alarm rate = Phi(-d\'/2 - c)\n\n' +
        'where Phi is the standard normal CDF.\n\n' +
        '| d\' | AUC = Phi(d\'/sqrt(2)) | Interpretation |\n' +
        '|----|----------------------|----------------|\n' +
        '| 0.5 | 0.64 | Slightly above chance |\n' +
        '| 1.0 | 0.76 | Fair |\n' +
        '| 2.0 | 0.92 | Good |\n' +
        '| 3.0 | 0.98 | Excellent |\n' +
        '| 4.0 | 0.998 | Near perfect |\n\n' +
        'Unequal-variance models (sigma_signal not equal to sigma_noise) produce asymmetric ROC curves on z-coordinates, common in recognition memory research.\n\n' +
        '**Bayesian SDT** incorporates prior probabilities: the optimal criterion minimises expected cost by placing it where the likelihood ratio L(x) = f(x|signal)/f(x|noise) equals:\n\n' +
        '(cost_FA x P(noise)) / (cost_miss x P(signal))\n\n' +
        'In anti-poaching: the cost of a miss (poacher kills a rhino) vastly exceeds the cost of a false alarm (rangers investigate a branch crack). So the optimal criterion shifts liberal — accept more false alarms to catch every real threat.\n\n' +
        'Machine learning classifiers are evaluated using ROC/AUC analysis directly descended from SDT — the field originated in 1940s radar engineering (Peterson, Birdsall, Fox at the University of Michigan) and was formalised by Green and Swets (1966). Modern applications include **deep learning calibration** and **fairness metrics** that decompose classifier performance across demographic groups.',
    },

    // ── Section 13: SIR Epidemic Model ───────────────────────────
    {
      title: 'SIR Epidemic Model',
      diagram: 'SIRModelDiagram',
      beginnerContent:
        'When a new disease spreads through a community, how can scientists predict how many people will get sick and when the outbreak will peak? The **SIR model** divides a population into three groups and tracks how people flow between them.\n\n' +
        '| Compartment | Who\'s in it | Flow |\n' +
        '|------------|-----------|------|\n' +
        '| **S — Susceptible** | People who can catch the disease | S decreases as people get infected |\n' +
        '| **I — Infected** | People who have the disease and can spread it | I rises, then falls as people recover |\n' +
        '| **R — Recovered** | People who are now immune (or have died) | R steadily increases |\n\n' +
        'The key number is **R0** ("R-naught") — how many new people one infected person infects on average in a fully susceptible population.\n\n' +
        '| Disease | R0 | Herd immunity threshold |\n' +
        '|---------|----|-----------------------|\n' +
        '| Measles | 12–18 | ~93–95% |\n' +
        '| Chickenpox | 10–12 | ~90–92% |\n' +
        '| COVID-19 (original) | 2.5–3.0 | ~60–67% |\n' +
        '| Seasonal flu | 1.2–1.5 | ~17–33% |\n' +
        '| Ebola | 1.5–2.5 | ~33–60% |\n\n' +
        'If R0 > 1, the disease spreads (epidemic). If R0 < 1, it dies out.\n\n' +
        '**Vaccination** works by moving people directly from S to R without going through I. When enough people are immune — the **herd immunity threshold** (approximately 1 - 1/R0) — the disease cannot sustain transmission.\n\n' +
        '**Think of it this way:** R0 is like the interest rate on a loan. If it\'s above 1, the debt (infection) grows. Below 1, it shrinks. Vaccination is like making payments that bring the rate below 1.',
      intermediateContent:
        '**The SIR differential equations:**\n\n' +
        '| Equation | Meaning |\n' +
        '|---------|--------|\n' +
        '| dS/dt = -beta x S x I / N | Susceptible people become infected |\n' +
        '| dI/dt = beta x S x I / N - gamma x I | Infected people accumulate, then recover |\n' +
        '| dR/dt = gamma x I | Recovered people accumulate |\n\n' +
        'Where beta = transmission rate, gamma = recovery rate, and R0 = beta / gamma.\n\n' +
        '**Worked example — a school outbreak:**\n\n' +
        'A school of 1,000 students. One student arrives with flu (R0 = 1.5, infectious period = 5 days).\n\n' +
        '| Parameter | Value | Calculation |\n' +
        '|-----------|-------|------------|\n' +
        '| gamma | 0.2/day | 1/infectious period = 1/5 |\n' +
        '| beta | 0.3/day | R0 x gamma = 1.5 x 0.2 |\n' +
        '| Herd immunity threshold | 33% | 1 - 1/1.5 |\n' +
        '| Epidemic peaks when S = | 667 | N/R0 = 1000/1.5 |\n' +
        '| Final size (total infected) | ~58% | From the final size equation |\n\n' +
        'The **final size equation**: 1 - R_inf/N = e^(-R0 x R_inf/N)\n\n' +
        'For R0 = 1.5: approximately 58% of the school is eventually infected. For R0 = 3: approximately 94%. For R0 = 15 (measles): over 99%.\n\n' +
        'If 40% of students are vaccinated: the effective R0 becomes 1.5 x (1 - 0.4) = 0.9 — below 1. The outbreak fizzles. This is herd immunity in action.',
      advancedContent:
        '**Extensions of the SIR model:**\n\n' +
        '| Model | Modification | Application |\n' +
        '|-------|-------------|-------------|\n' +
        '| **SEIR** | Adds Exposed (latent, not yet infectious) | Diseases with incubation periods |\n' +
        '| **SIS** | No lasting immunity (R goes back to S) | Gonorrhoea, common cold |\n' +
        '| **SIRS** | Waning immunity (R slowly returns to S) | Influenza (seasonal re-infection) |\n' +
        '| **Age-structured** | Different contact rates by age group | Childhood vs adult diseases |\n' +
        '| **Network-based** | Realistic contact networks replace homogeneous mixing | Super-spreader events |\n\n' +
        'The **effective reproduction number** Rt = R0 x S(t)/N tracks real-time transmissibility. When Rt drops below 1 (either through immunity buildup or interventions), the epidemic declines.\n\n' +
        'Stochastic SIR models handle small populations where random extinction of the infected class is possible — critical for modelling disease in isolated communities or wildlife populations.\n\n' +
        '**Network-based models** on scale-free networks reveal that super-spreader hubs dramatically alter epidemic dynamics. The herd immunity threshold depends on the **degree distribution variance**, not just R0:\n\n' +
        'Epidemic threshold: beta/gamma > <k> / (<k²> - <k>)\n\n' +
        'where <k> is mean degree and <k²> is the second moment. In highly heterogeneous networks (many low-degree nodes, few high-degree hubs), the epidemic threshold approaches zero — meaning any transmissible disease can spread if hubs are not immunised first. This is why targeted vaccination of high-contact individuals (healthcare workers, teachers) is more efficient than random vaccination.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each epidemic concept to its definition',
          pairs: [
            ['R0 (basic reproduction number)', 'Average new infections caused by one case in a fully susceptible population'],
            ['Herd immunity threshold', 'Fraction of population that must be immune to stop transmission (1 - 1/R0)'],
            ['Effective reproduction number (Rt)', 'Real-time R value accounting for current immunity levels'],
            ['Final size', 'Total fraction of population infected by the end of an epidemic'],
          ],
        },
      },
    },
  ],
};
