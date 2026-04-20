import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'habitats-and-biomes',
  title: 'Habitats & Biomes',
  category: 'ecology',
  icon: '🌿',
  tagline: 'From Kaziranga grasslands to Himalayan alpine meadows — where life thrives and why.',
  relatedStories: ['kaziranga-grass', 'snow-leopards-promise', 'cloud-weaver-of-tawang', 'dancing-deer-of-loktak-lake'],
  understand: [
    // ── Section 1: What Defines a Habitat ─────────────────────
    {
      title: 'What Defines a Habitat',
      diagram: 'GrassRhinoHabitatDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each habitat factor to its category',
          pairs: [
            ['Temperature, rainfall, soil type', 'Abiotic (non-living) factors'],
            ['Predators, food species, competitors', 'Biotic (living) factors'],
            ['Floodplain grasslands with wallowing pools', 'Indian rhinoceros habitat'],
            ['Floating vegetation mats over a lake', 'Sangai deer habitat'],
            ['Dense canopy with fruiting trees', 'Hoolock gibbon habitat'],
          ],
        },
      },
      beginnerContent:
        'Think of a habitat as an organism\'s **home address** — not just the geographic location, but everything that makes it liveable: food, water, shelter, temperature, neighbours. Move a rhino from tall floodplain grassland into dry scrubland, and it\'s like dropping a fish onto a pavement. The address is wrong.\n\n' +
        'Every habitat is shaped by two categories of factors:\n\n' +
        '| Factor type | Examples | Think of it as... |\n' +
        '|-------------|---------|--------------------|\n' +
        '| **Abiotic** (non-living) | Temperature, rainfall, soil type, sunlight, altitude, water chemistry | The house itself — walls, roof, plumbing |\n' +
        '| **Biotic** (living) | Food species, predators, competitors, parasites, symbiotic partners | The neighbours — helpful or hostile |\n\n' +
        'Change any factor significantly and the habitat may become unliveable. When a barrage raised water levels in Loktak Lake, Manipur, it thinned the floating phumdi mats that sangai deer depend on — their habitat literally sank beneath them, pushing the species toward extinction.\n\n' +
        '**Explore the diagram above** — it shows how the alluvial floodplain grasslands of the Brahmaputra valley provide everything the Indian one-horned rhinoceros needs: tall grass for cover, low-lying pools for wallowing, nutrient-rich soil renewed by annual floods.\n\n' +
        'Habitat destruction is the single greatest threat to biodiversity worldwide — responsible for more species declines than pollution, hunting, or climate change combined. When a forest is cleared for agriculture, the habitat doesn\'t just shrink. It **fragments** into isolated patches too small to sustain viable populations, with roads and settlements creating impassable barriers between them.\n\n' +
        '| Habitat feature | Why it matters | What happens when lost |\n' +
        '|----------------|---------------|----------------------|\n' +
        '| Tall alluvial grass | Cover from predators, food source | Rhinos exposed, starve |\n' +
        '| Wallowing pools | Thermoregulation, parasite control | Overheating, skin disease |\n' +
        '| Flood cycle | Renews soil nutrients, prevents forest takeover | Grassland converts to woodland |\n' +
        '| Corridors between patches | Gene flow, seasonal migration | Inbreeding, local extinction |\n\n' +
        '**Quick check:** Why is fragmentation worse than simple shrinkage? Because 10 tiny patches don\'t equal one large patch. Edge effects (more wind, light, predators) penetrate deep into small fragments, and animals can\'t cross hostile terrain between them.',
      intermediateContent:
        '**Species Distribution Models (SDMs)** predict where a species *could* live by matching occurrence records against environmental variables.\n\n' +
        '| SDM method | Input data | Strengths | Limitations |\n' +
        '|-----------|-----------|-----------|-------------|\n' +
        '| **MaxEnt** | Presence-only | Works with incomplete surveys | Cannot distinguish absence from non-detection |\n' +
        '| **GLM / GAM** | Presence + absence | Statistically rigorous | Requires confirmed absence data |\n' +
        '| **Random Forest** | Presence + background | Handles complex interactions | Black-box; hard to interpret |\n' +
        '| **Ensemble** | Multiple models averaged | Reduces individual model bias | Computationally expensive |\n\n' +
        'For the Indian rhinoceros, SDMs identify the Brahmaputra floodplain, Terai grasslands, and parts of the Duars as high-suitability zones — matching observed populations almost exactly.\n\n' +
        '**Habitat fragmentation metrics:**\n\n' +
        '| Metric | What it measures | Conservation meaning |\n' +
        '|--------|-----------------|---------------------|\n' +
        '| Patch size | Area of each fragment | Larger patches sustain more species |\n' +
        '| Edge-to-area ratio | Shape complexity | More edge = more degradation from wind, light, invasives |\n' +
        '| Nearest-neighbour distance | Isolation between patches | Greater distance = less dispersal |\n' +
        '| Connectivity index | Functional linkage | High connectivity = gene flow maintained |\n\n' +
        'The **species–area relationship** S = cA^z (S = species count, A = area, c and z are constants, z ≈ 0.15–0.35) predicts that **halving habitat area reduces species by 20–30%**. This is not a guess — it has been confirmed in hundreds of studies from island biogeography to forest fragments.',
      advancedContent:
        '**Systematic conservation planning** (Margules & Pressey, 2000) solves an optimisation problem: which set of areas protects the most biodiversity at least cost?\n\n' +
        '| Tool | Algorithm | Key innovation |\n' +
        '|------|----------|----------------|\n' +
        '| **Marxan** | Simulated annealing | Minimises cost while meeting representation targets |\n' +
        '| **Zonation** | Iterative cell removal | Produces a continuous priority ranking across the landscape |\n' +
        '| **prioritizr** (R package) | Integer linear programming | Guarantees optimal solution (not just near-optimal) |\n\n' +
        'Inputs include species occurrence layers, habitat maps, connectivity matrices, land costs, and existing protected areas. Analyses consistently identify the Kaziranga–Karbi Anglong corridor, the Namdapha–Kamlang complex, and Meghalaya\'s sacred groves as irreplaceable.\n\n' +
        '**Circuit theory** (McRae et al., 2008) models animal movement as electrical current flowing through a resistance surface. Low-resistance cells (forest) carry more current (animal movement) than high-resistance cells (roads, settlements). The effective resistance between two habitat patches quantifies connectivity.\n\n' +
        '| Parameter | Ecological analogue |\n' +
        '|-----------|--------------------|\n' +
        '| Current | Animal movement / gene flow |\n' +
        '| Resistance | Landscape permeability (forest = low, highway = high) |\n' +
        '| Voltage | Movement probability gradient |\n' +
        '| Pinch points | Critical corridors (bottlenecks) |\n\n' +
        'This approach has mapped optimal elephant corridors across Assam, directly guiding highway design to include wildlife underpasses at pinch points.',
    },

    // ── Section 2: Terrestrial Biomes ─────────────────────────
    {
      title: 'Terrestrial Biomes',
      diagram: 'ClimateZonesDiagram',
      interactive: {
        type: 'true-false',
        props: {
          title: 'Test your biome knowledge',
          statements: [
            { text: 'Deserts always have hot temperatures.', answer: false, explanation: 'Antarctica is a desert (< 250 mm precipitation per year) but is the coldest continent. Deserts are defined by rainfall, not temperature.' },
            { text: 'Tropical rainforests have the highest biodiversity of any terrestrial biome.', answer: true, explanation: 'A single hectare of Amazonian rainforest can contain up to 300 tree species — more than in all of northern Europe.' },
            { text: 'Climbing a mountain from base to summit passes through biome transitions similar to travelling from equator to pole.', answer: true, explanation: 'Temperature drops ~6.5°C per 1,000 m of altitude, compressing tropical-to-alpine transitions into just tens of kilometres.' },
            { text: 'Grasslands exist only because there is not enough rain for forests.', answer: false, explanation: 'Some grasslands, like Kaziranga\'s floodplain, receive heavy rainfall (1,500–2,500 mm) but are maintained by annual flooding, grazing, and fire — not drought.' },
          ],
        },
      },
      beginnerContent:
        '**Biomes** are Earth\'s major ecosystem types, classified by dominant vegetation and climate. Think of them as the planet\'s broad "neighbourhoods" — each with a distinct character.\n\n' +
        '| Biome | Temperature | Annual rainfall | Signature feature |\n' +
        '|-------|-----------|----------------|-------------------|\n' +
        '| **Tropical rainforest** | Warm year-round (25–28°C) | > 2,000 mm | Tallest canopy, highest biodiversity |\n' +
        '| **Tropical dry forest** | Warm, distinct seasons | 1,000–2,000 mm | Deciduous trees shed leaves in dry season |\n' +
        '| **Savanna / grassland** | Warm | 500–1,500 mm (seasonal) | Grasses dominate, scattered trees |\n' +
        '| **Desert** | Variable (hot or cold) | < 250 mm | Extreme water conservation |\n' +
        '| **Temperate forest** | Moderate, seasonal | 750–1,500 mm | Deciduous or mixed; autumn leaf colours |\n' +
        '| **Temperate grassland** | Hot summers, cold winters | 250–750 mm | Too dry for forests, too wet for desert |\n' +
        '| **Boreal forest (taiga)** | Long cold winters | 400–1,000 mm | Conifers (spruce, pine, fir) |\n' +
        '| **Tundra** | Extremely cold, permafrost | < 250 mm | Treeless; mosses, lichens, low shrubs |\n\n' +
        'Each biome shapes its residents through millions of years of selection pressure. Desert organisms conserve water through waxy coatings, nocturnal activity, and concentrated urine. Tundra plants grow flat against the ground to escape wind. Tropical rainforest trees race upward to compete for light — a single hectare of Amazonian forest may hold 300 tree species, more than all of northern Europe combined.\n\n' +
        '**Altitude compresses biome transitions.** Climbing from the Brahmaputra valley floor to the peaks of Arunachal Pradesh — a horizontal distance of about 100 km — you pass through tropical, subtropical, temperate, subalpine, and alpine zones. It\'s the equivalent of travelling from equatorial India to the Arctic, compressed into a single mountain slope.\n\n' +
        '| Altitude band | Approx. elevation | Vegetation | Temperature drop |\n' +
        '|--------------|------------------|-----------|------------------|\n' +
        '| Tropical | 0–900 m | Semi-evergreen forest, bamboo | Baseline |\n' +
        '| Subtropical | 900–1,800 m | Broadleaf, pine, rhododendron | −6°C |\n' +
        '| Temperate | 1,800–3,000 m | Oaks, magnolias, laurels | −12°C |\n' +
        '| Subalpine | 3,000–4,000 m | Birch, juniper, fir | −20°C |\n' +
        '| Alpine | 4,000–5,000 m | Meadows, scrub, bare rock | −26°C+ |\n\n' +
        '**Why does temperature drop with altitude?** As air rises, it expands (lower pressure) and cools at about 6.5°C per 1,000 metres — the **environmental lapse rate**. This single physical fact creates entire stacked worlds of life on a single mountainside.',
      intermediateContent:
        '**Whittaker\'s biome classification** plots biomes on two axes: mean annual temperature and mean annual precipitation. This simple framework predicts vegetation type with surprising accuracy.\n\n' +
        '| Climate combination | Predicted biome | Real-world example |\n' +
        '|--------------------|----------------|--------------------|\n' +
        '| Hot + wet (>2,000 mm) | Tropical rainforest | Namdapha, Arunachal Pradesh |\n' +
        '| Hot + moderate + seasonal | Tropical dry forest / savanna | Manas corridor drier zones |\n' +
        '| Hot + dry (<250 mm) | Desert | Thar, Rajasthan |\n' +
        '| Cool + moderate | Temperate forest | Tawang oak–rhododendron zone |\n' +
        '| Cold + low | Tundra | Himalayan alpine above 4,500 m |\n\n' +
        '**Disturbance regimes** maintain some biomes against climatic expectations. The Kaziranga floodplain receives 1,500–2,500 mm of rain — enough to support dense forest. Yet it remains grassland because annual Brahmaputra floods deposit silt, drown tree seedlings, and reset succession. Remove the floods (e.g., with embankments) and the grassland converts to woodland within decades — a disaster for grassland-dependent species like the rhino and pygmy hog.\n\n' +
        '| Disturbance type | Frequency | Biome maintained | Mechanism |\n' +
        '|-----------------|-----------|-----------------|----------|\n' +
        '| Flooding | Annual | Alluvial grassland | Drowns woody seedlings, deposits silt |\n' +
        '| Fire | 1–10 years | Savanna / pine forest | Kills fire-intolerant species |\n' +
        '| Grazing | Continuous | Grassland | Suppresses woody plant recruitment |\n' +
        '| Windthrow | Decades | Gap-phase forest | Creates light gaps for regeneration |\n\n' +
        '**Net Primary Productivity (NPP)** — the rate at which plants fix carbon after accounting for their own respiration — varies enormously:\n\n' +
        '| Biome | NPP (g C/m²/year) | Why |\n' +
        '|-------|-------------------|-----|\n' +
        '| Tropical rainforest | 1,000–2,200 | Warm + wet + year-round sunlight |\n' +
        '| Temperate forest | 600–1,200 | Seasonal limitation |\n' +
        '| Boreal forest | 200–600 | Cold + short growing season |\n' +
        '| Tundra | 10–140 | Extreme cold, permafrost |\n' +
        '| Desert | 0–90 | Water limitation |\n' +
        '| Alluvial floodplain grassland | 800–1,500 | Nutrient-rich silt + moisture |',
      advancedContent:
        '**Biome shifts under climate change** are modelled using Dynamic Global Vegetation Models (DGVMs) that simulate plant physiology, competition, and disturbance under future climate scenarios.\n\n' +
        '| Model | Approach | Key outputs |\n' +
        '|-------|---------|-------------|\n' +
        '| **LPJ-GUESS** | Individual-based, mechanistic | Species-level shifts, carbon fluxes |\n' +
        '| **BIOME4** | Equilibrium biogeography | Potential vegetation under new climate |\n' +
        '| **ED2** | Ecosystem demography | Size-structured competition dynamics |\n\n' +
        'Projections for the Eastern Himalayas under RCP 8.5 (high emissions):\n\n' +
        '| Current zone | Projected shift by 2100 | Species at risk |\n' +
        '|-------------|----------------------|----------------|\n' +
        '| Alpine meadow (4,000–5,000 m) | Shrinks by 60–80% as treeline advances | Snow leopard, alpine marmot, Brahma kamal |\n' +
        '| Subalpine forest (3,000–4,000 m) | Shifts upward 300–500 m | Red panda, musk deer |\n' +
        '| Temperate forest (1,800–3,000 m) | Subtropical species invade | Endemic oaks, rhododendrons outcompeted |\n\n' +
        'The **velocity of climate change** — the speed at which climate zones shift across the landscape (km/year) — determines whether species can track their preferred conditions. In flat terrain, velocity is high (organisms must migrate far). In mountains, velocity is low (moving 100 m upslope = moving hundreds of kilometres poleward). This makes mountains potential **climate refugia**, but only if the summit is high enough — species on lower peaks may run out of mountain before they outrun warming.',
    },

    // ── Section 3: Aquatic Ecosystems ─────────────────────────
    {
      title: 'Aquatic Ecosystems',
      diagram: 'WaterCycleDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each aquatic ecosystem to its defining feature',
          pairs: [
            ['River headwaters', 'Cold, fast-flowing, oxygen-rich, low nutrients'],
            ['River floodplain', 'Warm, slow, sediment-laden, nutrient-rich'],
            ['Wetland / beel', 'Shallow, seasonal fluctuation, fish nursery'],
            ['Estuary', 'Freshwater meets saltwater — extreme productivity'],
            ['Coral reef', 'Calcium carbonate structures built by tiny animals over millennia'],
            ['Floating phumdi mat', 'Decomposing vegetation thick enough to walk on'],
          ],
        },
      },
      beginnerContent:
        'Water covers 71% of Earth\'s surface, but aquatic ecosystems are far from uniform. A cold mountain stream and a tropical coral reef are as different as a desert and a rainforest.\n\n' +
        '**Freshwater ecosystems** — rivers, lakes, ponds, streams, wetlands — cover less than 1% of Earth\'s surface but support roughly **10% of all known animal species**. That makes them spectacularly species-dense per unit area.\n\n' +
        '| Freshwater type | Key features | Example |\n' +
        '|----------------|-------------|--------|\n' +
        '| Mountain stream | Fast, cold, oxygen-rich, rocky bed | Upper Brahmaputra tributaries in Arunachal |\n' +
        '| Lowland river | Slow, warm, sediment-laden, nutrient-rich | Brahmaputra in the Assam valley |\n' +
        '| Floodplain lake (beel) | Seasonal, shallow, connected to river during floods | Deepor Beel near Guwahati |\n' +
        '| Wetland / marsh | Saturated soil, emergent vegetation, filter function | Loktak Lake, Manipur |\n' +
        '| Pond | Small, still, often temporary | Village ponds across Assam |\n\n' +
        'Rivers change character from source to mouth. Think of it as ageing: young rivers are fast and narrow (like streams tumbling off the Naga Hills), middle-aged rivers widen and slow, and old rivers meander broadly across flat plains, depositing sediment. Each stage supports different communities — stoneflies and trout in the headwaters, catfish and dolphins in the lower reaches.\n\n' +
        '**Marine ecosystems** are equally varied:\n\n' +
        '| Marine type | Depth / location | Biodiversity | Productivity |\n' +
        '|------------|-----------------|-------------|-------------|\n' +
        '| Coral reef | Shallow, tropical | Extremely high (25% of marine fish) | High |\n' +
        '| Estuary | River meets sea | Moderate species, huge biomass | Very high |\n' +
        '| Mangrove | Tropical coast | Moderate | High (nursery for fish/shrimp) |\n' +
        '| Open ocean | Surface to deep | Low density, high total | Low per area |\n' +
        '| Deep sea | > 1,000 m | Sparse, highly specialised | Very low |\n\n' +
        'The Sundarbans — where the Ganges-Brahmaputra delta meets the Bay of Bengal — is the world\'s largest mangrove forest. Estuaries like this are among the most productive ecosystems on Earth, mixing freshwater nutrients with saltwater to create nurseries for commercially important fish and shrimp.\n\n' +
        '**Quick check:** Why are wetlands called "Earth\'s kidneys"? Because they filter pollutants from water the same way kidneys filter waste from blood — naturally, continuously, and for free.',
      intermediateContent:
        '**Lake zonation** divides any lake into distinct ecological zones:\n\n' +
        '| Zone | Location | Light? | Key organisms |\n' +
        '|------|---------|--------|---------------|\n' +
        '| **Littoral** | Shallow edges | Full sunlight | Rooted plants, frogs, insect larvae, wading birds |\n' +
        '| **Limnetic** | Open surface water | Full sunlight | Phytoplankton, zooplankton, fish |\n' +
        '| **Profundal** | Deep, below light | No light | Bacteria, benthic invertebrates |\n' +
        '| **Benthic** | Lake floor | Variable | Decomposers, burrowing organisms |\n\n' +
        'Lakes are classified by nutrient status:\n\n' +
        '| Type | Nutrients | Oxygen | Clarity | Algal growth |\n' +
        '|------|----------|--------|---------|-------------|\n' +
        '| **Oligotrophic** | Low | High throughout | Clear | Minimal |\n' +
        '| **Mesotrophic** | Moderate | Moderate | Moderate | Some |\n' +
        '| **Eutrophic** | High | Low in deep water | Murky | Excessive |\n' +
        '| **Hypereutrophic** | Very high | Critically low | Opaque | Algal blooms, fish kills |\n\n' +
        'Many wetlands across the Brahmaputra valley are shifting from mesotrophic to eutrophic due to agricultural runoff (fertilisers) and sewage — a process called **cultural eutrophication**. Excess nutrients fuel algal blooms that block light, and when the algae die and decompose, bacteria consume dissolved oxygen, creating **dead zones** where fish suffocate.\n\n' +
        '**Worked example — dissolved oxygen:** A healthy river maintains >6 mg/L dissolved oxygen (DO). Below a sewage outfall, bacterial decomposition drops DO to 2 mg/L — lethal for most fish. Over several kilometres downstream, reaeration gradually restores DO. This recovery profile is the **oxygen sag curve**, a fundamental concept in water quality management.',
      advancedContent:
        '**River continuum concept (RCC)** (Vannote et al., 1980) predicts how biological communities change predictably from headwaters to mouth:\n\n' +
        '| Stream order | Width | Energy source | Dominant organisms | P/R ratio |\n' +
        '|-------------|-------|--------------|-------------------|----------|\n' +
        '| 1–3 (headwaters) | < 5 m | Allochthonous (leaf litter) | Shredders, collectors | < 1 (heterotrophic) |\n' +
        '| 4–6 (mid-reach) | 5–50 m | Autochthonous (algae) | Grazers, collectors | > 1 (autotrophic) |\n' +
        '| 7+ (large river) | > 50 m | Fine particulate organic matter | Collectors | < 1 (heterotrophic) |\n\n' +
        'P/R ratio = production/respiration. Headwaters and large rivers are both net consumers of organic matter (heterotrophic), but for different reasons — headwaters depend on terrestrial leaf input, while large rivers process fine particles from upstream.\n\n' +
        '**Flood pulse concept** (Junk et al., 1989) argues that in large floodplain rivers like the Brahmaputra, the lateral exchange between river and floodplain during annual floods is more important than the longitudinal gradient described by RCC. The flood pulse:\n' +
        '- Connects river to beels (oxbow lakes), enabling fish migration to spawning grounds\n' +
        '- Deposits nutrient-rich silt on the floodplain, maintaining grassland productivity\n' +
        '- Creates a "moving littoral" — shallow, warm, highly productive water at the flood edge\n\n' +
        '| Hydrological metric | Ecological significance |\n' +
        '|--------------------|----------------------|\n' +
        '| Flood magnitude | Determines area of floodplain inundated |\n' +
        '| Flood duration | Longer = more nutrient exchange, more fish spawning |\n' +
        '| Flood timing | Must match species\' life cycles (fish breeding, plant germination) |\n' +
        '| Rate of rise/fall | Gradual = organisms can track; sudden = mortality |\n' +
        '| Flow variability | High variability maintains heterogeneous habitats |',
    },

    // ── Section 4: Wetlands — Floating Worlds ─────────────────
    {
      title: 'Wetlands: Floating Worlds',
      diagram: 'LoktakPhumdiDiagram',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'Loktak Lake in Manipur has floating phumdi mats up to 2 metres thick — dense enough to support deer, houses, and even small farms.',
            'Wetlands store roughly 20–30% of terrestrial carbon despite covering only 5–8% of land — drain them and that carbon enters the atmosphere as CO₂.',
            'Deepor Beel near Guwahati filters Guwahati\'s wastewater naturally — a service worth crores if replaced by a treatment plant.',
            'A single hectare of wetland can store 5,000–15,000 cubic metres of floodwater — acting as a natural sponge during monsoon.',
          ],
        },
      },
      beginnerContent:
        'Wetlands are transitional zones between land and water — not quite either, but more productive than both. Think of them as **sponges, filters, and nurseries** rolled into one.\n\n' +
        '| Wetland service | How it works | Value |\n' +
        '|----------------|------------|-------|\n' +
        '| **Flood buffering** | Absorbs excess water during monsoon, releases slowly | Prevents downstream flooding |\n' +
        '| **Water filtration** | Plants and microbes trap sediment, break down pollutants | Natural water treatment |\n' +
        '| **Carbon storage** | Waterlogged soil prevents decomposition, locking carbon | Climate regulation |\n' +
        '| **Fish nursery** | Shallow, warm, nutrient-rich — ideal for juveniles | Food security for millions |\n' +
        '| **Biodiversity haven** | Unique niche between land and water | Amphibians, wading birds, aquatic plants |\n\n' +
        'Loktak Lake in Manipur is one of the world\'s most unusual wetlands. Its surface is covered by **phumdis** — floating mats of interlocked dead and living vegetation, up to 2 metres thick and strong enough to support deer, houses, and small farms. The diagram above shows how these mats form and function.\n\n' +
        'Keibul Lamjao National Park, located on Loktak\'s southern phumdi, is the **only floating national park on Earth**. It protects the **sangai** (Eld\'s deer), a species found nowhere else, which has evolved to walk on the springy phumdi surface with splayed hooves — an adaptation as specific as a polar bear\'s fur.\n\n' +
        '| Wetland type | Water source | Vegetation | Example |\n' +
        '|-------------|-------------|-----------|--------|\n' +
        '| **Marsh** | Surface water, seasonal | Grasses, sedges, reeds | Brahmaputra floodplain marshes |\n' +
        '| **Swamp** | Standing water, permanent | Trees, shrubs (swamp forest) | Hollongapar Gibbon Sanctuary |\n' +
        '| **Bog** | Rainwater only (ombrotrophic) | Sphagnum moss, acidic | High-altitude bogs in Meghalaya |\n' +
        '| **Fen** | Groundwater-fed | Sedges, grasses, mineral-rich | Rare in tropical Asia |\n' +
        '| **Floating mat (phumdi)** | Lake water from below | Dead and living vegetation interlock | Loktak Lake, Manipur |\n\n' +
        'Despite their enormous value, wetlands are disappearing faster than forests. Globally, over **35% of wetlands have been lost since 1970** — drained for agriculture, filled for construction, or degraded by pollution and invasive species like water hyacinth.',
      intermediateContent:
        '**Phumdi formation and ecology:**\n\n' +
        'Phumdis form when dead organic matter accumulates faster than it decomposes. In Loktak, sediments and roots interweave into a buoyant mat. During the monsoon, mats float freely as water levels rise; in winter, they may touch the lake bottom.\n\n' +
        '| Phumdi layer | Thickness | Composition | Function |\n' +
        '|-------------|----------|-------------|----------|\n' +
        '| Upper (living) | 10–30 cm | Grasses, herbs, sedges | Photosynthesis, habitat surface |\n' +
        '| Middle | 30–80 cm | Partially decomposed roots and stems | Structural buoyancy |\n' +
        '| Lower (submerged) | 50–100 cm | Decaying organic matter | Nutrient cycling, anchorage |\n\n' +
        'The Ithai Barrage (built 1983) for hydroelectric power raised Loktak\'s water level, permanently submerging thick phumdis and thinning others. Thinner mats cannot support the sangai, whose population crashed.\n\n' +
        '**Wetland valuation — what are they worth in rupees?**\n\n' +
        '| Ecosystem service | Method | Estimated value (per hectare/year) |\n' +
        '|-------------------|--------|-----------------------------------|\n' +
        '| Flood control | Replacement cost (embankments) | ₹1.5–4.0 lakh |\n' +
        '| Water purification | Treatment plant equivalent | ₹2.0–6.0 lakh |\n' +
        '| Fisheries | Market value of catch | ₹0.8–2.5 lakh |\n' +
        '| Carbon storage | Social cost of carbon | ₹0.5–1.5 lakh |\n' +
        '| Biodiversity / tourism | Willingness-to-pay surveys | ₹0.3–1.0 lakh |\n' +
        '| **Total** | | **₹5–15 lakh** |\n\n' +
        'Deepor Beel (a Ramsar site near Guwahati) provides water filtration services worth an estimated ₹30–50 crore per year. Yet its area has shrunk by ~30% in three decades due to encroachment and garbage dumping. Replacing its filtration function with a treatment plant would cost several hundred crores — economics argues powerfully for conservation.',
      advancedContent:
        '**Wetland carbon dynamics** are complex because waterlogging both stores and emits greenhouse gases:\n\n' +
        '| Process | Gas | Conditions | Net effect |\n' +
        '|---------|-----|-----------|------------|\n' +
        '| Photosynthesis | CO₂ uptake | Sunlight, growing season | Carbon sink |\n' +
        '| Anaerobic decomposition | CH₄ emission | Waterlogged, warm | Carbon source (strong GHG) |\n' +
        '| Aerobic decomposition | CO₂ emission | Drained, exposed | Carbon source |\n' +
        '| Peat accumulation | C stored in soil | Waterlogged, net growth > decay | Long-term sink |\n\n' +
        'Intact wetlands are net carbon sinks over centuries (peat accumulation outweighs CH₄ emissions). But **draining a wetland** flips the equation catastrophically — stored carbon oxidises rapidly, releasing CO₂ that took millennia to sequester.\n\n' +
        '**Constructed wetlands** apply natural principles to engineered systems:\n\n' +
        '| Design type | Flow pattern | Best for | Removal efficiency |\n' +
        '|------------|------------|---------|-------------------|\n' +
        '| Free water surface | Horizontal, open | BOD, suspended solids | 70–85% BOD |\n' +
        '| Subsurface horizontal | Through gravel bed | BOD, pathogens | 80–90% BOD |\n' +
        '| Vertical flow | Downward percolation | Nitrogen (nitrification) | 80–95% NH₄ |\n' +
        '| Hybrid (multi-stage) | Combines above | All parameters | 85–95%+ |\n\n' +
        'Several towns in the Brahmaputra valley are piloting constructed wetlands for wastewater treatment — cheaper to build and maintain than mechanical plants, and they provide habitat, flood buffering, and aesthetic value as co-benefits.',
    },

    // ── Section 5: Ecological Succession ──────────────────────
    {
      title: 'How Habitats Change Over Time',
      diagram: 'ForestSuccessionDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each succession stage to its characteristics',
          pairs: [
            ['Pioneer stage', 'Lichens, mosses, grasses colonise bare ground — fast-growing, sun-loving'],
            ['Early successional', 'Shrubs and small trees establish; soil deepens; shade increases'],
            ['Mid-successional', 'Canopy closes; shade-tolerant species replace pioneers'],
            ['Climax community', 'Stable, self-replacing forest with maximum structural complexity'],
            ['Post-disturbance reset', 'Fire, flood, or logging resets succession — new cycle begins'],
          ],
        },
      },
      beginnerContent:
        'Habitats are not frozen in time. Leave a bare patch of ground alone and watch what happens: first grasses appear, then shrubs, then small trees, then tall forest. This predictable sequence is called **ecological succession** — nature\'s slow-motion construction project.\n\n' +
        'Imagine succession as building a city from scratch:\n\n' +
        '| Stage | Analogy | What happens | Timeframe |\n' +
        '|-------|---------|-------------|----------|\n' +
        '| **Pioneer** | Tent camp | Lichens, mosses, grasses colonise bare rock/soil | 0–5 years |\n' +
        '| **Early** | Wooden houses | Shrubs and fast-growing trees (bamboo, alder) establish | 5–25 years |\n' +
        '| **Mid** | Brick buildings | Canopy closes; shade-tolerant trees replace pioneers | 25–100 years |\n' +
        '| **Climax** | Established city | Stable, self-replacing forest with maximum complexity | 100–500+ years |\n\n' +
        '**Explore the diagram above** — it shows how a bare floodplain gradually transforms into mature forest through these stages.\n\n' +
        'There are two types of succession:\n' +
        '- **Primary succession** starts from nothing — bare rock after a landslide, a new volcanic island, a retreating glacier. There is no soil, no seeds, no life. Lichens break rock into soil, mosses take root, then gradually larger plants colonise. This can take centuries.\n' +
        '- **Secondary succession** starts from disruption — an abandoned rice paddy, a burned forest, a drained wetland. Soil and seed bank already exist, so recovery is much faster (decades rather than centuries).\n\n' +
        '**Why does this matter for conservation?** In Kaziranga, annual Brahmaputra floods **reset succession** on the floodplain, preventing grassland from becoming forest. Without floods, succession would march forward and the grassland — home to rhinos, pygmy hogs, Bengal floricans — would be replaced by woodland. The floods are not a disaster; they are the reset button that maintains one of Asia\'s most important habitats.\n\n' +
        '| Succession interrupter | Habitat maintained | Species that depend on it |\n' +
        '|-----------------------|-------------------|-------------------------|\n' +
        '| Annual flooding | Floodplain grassland | Indian rhinoceros, pygmy hog |\n' +
        '| Periodic fire | Savanna / open woodland | Bengal florican, swamp deer |\n' +
        '| Elephant browsing | Mixed forest-grassland | Diverse plant community |\n' +
        '| Shifting cultivation (jhum) | Early successional mosaic | Many forest-edge species |',
      intermediateContent:
        '**Facilitation, tolerance, and inhibition** — three models of how species replace each other during succession (Connell & Slatyer, 1977):\n\n' +
        '| Model | Mechanism | Example |\n' +
        '|-------|----------|--------|\n' +
        '| **Facilitation** | Early species improve conditions for later ones | Alders fix nitrogen, enriching soil for oaks |\n' +
        '| **Tolerance** | Later species simply tolerate conditions better | Shade-tolerant saplings outgrow shade-intolerant pioneers |\n' +
        '| **Inhibition** | Early species resist replacement until they die | Dense bamboo thickets block tree seedlings for decades |\n\n' +
        'In practice, all three operate simultaneously at different scales within the same succession.\n\n' +
        '**Worked example — secondary succession on an abandoned jhum field in Meghalaya:**\n\n' +
        '| Year after abandonment | Dominant vegetation | Soil organic carbon | Bird species count |\n' +
        '|-----------------------|--------------------|--------------------|-------------------|\n' +
        '| 0 (just abandoned) | Bare soil, crop residues | 1.2% | 5–10 |\n' +
        '| 1–3 | Grasses, ferns, *Imperata* | 1.5% | 15–25 |\n' +
        '| 5–10 | Shrubs, bamboo, *Macaranga* | 2.0% | 30–45 |\n' +
        '| 15–30 | Young secondary forest | 2.8% | 50–70 |\n' +
        '| 50–100 | Mature secondary forest | 3.5% | 80–100 |\n' +
        '| 200+ (sacred grove) | Old-growth, structurally complex | 4.5%+ | 120–150+ |\n\n' +
        'This is why Meghalaya\'s **sacred groves** — protected for centuries by indigenous Khasi law — are so biologically rich. They represent succession that has been allowed to run to completion without interruption. A sacred grove holds 3–4x the bird species and 2–3x the tree species of an equivalent area of young regrowth.',
      advancedContent:
        '**Markov chain models** of succession treat each vegetation state as a node and transition probabilities as edges. The transition matrix **P** gives the probability of moving from state *i* to state *j* in one time step:\n\n' +
        '```\n' +
        'P = | Grassland→Grassland  Grassland→Shrub  Grassland→Forest |\n' +
        '    | Shrub→Grassland      Shrub→Shrub      Shrub→Forest     |\n' +
        '    | Forest→Grassland     Forest→Shrub      Forest→Forest    |\n' +
        '```\n\n' +
        'For the Kaziranga floodplain (with annual flooding):\n\n' +
        '| From \\ To | Grassland | Shrubland | Forest |\n' +
        '|-----------|-----------|-----------|--------|\n' +
        '| **Grassland** | 0.85 | 0.12 | 0.03 |\n' +
        '| **Shrubland** | 0.30 | 0.55 | 0.15 |\n' +
        '| **Forest** | 0.05 | 0.10 | 0.85 |\n\n' +
        'The high Grassland→Grassland probability (0.85) reflects flood-maintained stability. The Shrubland→Grassland reversal (0.30) shows how floods reset successional patches. Without flooding, these probabilities shift dramatically:\n\n' +
        '| From \\ To (no floods) | Grassland | Shrubland | Forest |\n' +
        '|----------------------|-----------|-----------|--------|\n' +
        '| **Grassland** | 0.50 | 0.40 | 0.10 |\n' +
        '| **Shrubland** | 0.05 | 0.50 | 0.45 |\n' +
        '| **Forest** | 0.01 | 0.04 | 0.95 |\n\n' +
        'Solving for the **stationary distribution** (the long-term equilibrium) shows that with flooding, the landscape stabilises at ~60% grassland, ~25% shrubland, ~15% forest. Without flooding, it converges to ~5% grassland, ~15% shrubland, ~80% forest — a catastrophic loss of grassland habitat.\n\n' +
        'This quantitative framework directly informs management: park authorities can calculate how much controlled flooding or burning is needed to maintain target habitat proportions.',
    },

    // ── Section 6: The Sangai and Loktak ──────────────────────
    {
      title: 'When Habitat Changes: The Sangai\'s Story',
      diagram: 'LoktakSangaiDiagram',
      interactive: {
        type: 'true-false',
        props: {
          title: 'Test your understanding of habitat-species relationships',
          statements: [
            { text: 'The sangai deer can survive in any grassland habitat, not just phumdis.', answer: false, explanation: 'The sangai has evolved splayed hooves and a light gait specifically for walking on floating phumdi mats. It cannot thrive on solid ground — its adaptations are habitat-specific.' },
            { text: 'The Ithai Barrage was built to protect Loktak Lake from flooding.', answer: false, explanation: 'The barrage was built for hydroelectric power generation. It raised water levels, which thinned the phumdi mats the sangai depends on.' },
            { text: 'A species can go extinct even if its total habitat area stays the same, if habitat quality degrades.', answer: true, explanation: 'The sangai illustrates this perfectly — Loktak Lake still exists, but thinner phumdis and fluctuating water levels have degraded habitat quality below what the species needs.' },
            { text: 'Removing an invasive species is always the best conservation action.', answer: false, explanation: 'The best action depends on the specific threat. For the sangai, managing water levels (Ithai Barrage operation) matters more than invasive species control.' },
          ],
        },
      },
      beginnerContent:
        'The **sangai** (*Rucervus eldii eldii*) — also called the dancing deer for its graceful gait on floating vegetation — is one of the world\'s most endangered deer species. Fewer than 260 individuals survive, all within a single habitat: the phumdi mats of Loktak Lake\'s Keibul Lamjao National Park.\n\n' +
        'This is a story about what happens when a species is perfectly adapted to one specific habitat — and that habitat changes.\n\n' +
        '| Timeline | Event | Effect on sangai habitat |\n' +
        '|---------|-------|------------------------|\n' +
        '| Pre-1983 | Loktak\'s water level fluctuated naturally | Thick phumdis (1.5–2 m), sangai thrived |\n' +
        '| 1983 | Ithai Barrage built for hydroelectric power | Water level raised permanently |\n' +
        '| 1983–2000 | Permanent flooding thins phumdi mats | Mats too weak to support deer; drowning risk |\n' +
        '| 2000s | Population drops to ~100 individuals | Species classified as Critically Endangered |\n' +
        '| 2010s–now | Conservation efforts, water management | Slow recovery to ~260, still fragile |\n\n' +
        'The sangai\'s hooves are **splayed** — spread wide like snowshoes — an adaptation for distributing its weight across soft, floating vegetation. On solid ground, this adaptation is a disadvantage. The sangai cannot simply relocate to a different grassland; it evolved *for* phumdis and only phumdis.\n\n' +
        '**The lesson:** Habitat is not just "somewhere green." It is a precise set of conditions that a species has been shaped to exploit over evolutionary time. Change the conditions — even slightly, even with good intentions (hydroelectric power helps people) — and you can push a species toward extinction.\n\n' +
        '| Sangai adaptation | Phumdi feature it matches | What happens if feature changes |\n' +
        '|-------------------|------------------------|---------------------------------|\n' +
        '| Splayed hooves | Soft, floating surface | On solid ground, hooves are inefficient |\n' +
        '| Light body weight | Mat buoyancy limit | Heavier deer species would sink through |\n' +
        '| Grazing on phumdi grasses | Specific grass species growing on mats | Different grasses = nutritional mismatch |\n' +
        '| Swimming ability | Gaps between phumdi patches | If water is too deep or current too strong, drowning |',
      intermediateContent:
        '**Population dynamics of a habitat-limited species:**\n\n' +
        'The sangai\'s population is ultimately limited by available phumdi area of sufficient thickness. We can model this with a simple carrying capacity equation:\n\n' +
        '`K = (total suitable phumdi area) × (deer density at food-limited carrying capacity)`\n\n' +
        '| Parameter | Pre-barrage (1980) | Post-barrage (2000) | Current (2024) |\n' +
        '|-----------|-------------------|--------------------|-----------------|\n' +
        '| Total phumdi area (km²) | ~40 | ~35 | ~38 |\n' +
        '| Suitable thickness (>1 m) | 85% | 30% | 50% |\n' +
        '| Effective habitat (km²) | 34 | 10.5 | 19 |\n' +
        '| Estimated K (deer) | ~500 | ~150 | ~300 |\n' +
        '| Actual population | ~400–500 | ~100 | ~260 |\n\n' +
        'The population tracks carrying capacity closely, confirming that habitat quality — not poaching, disease, or predation — is the primary limiting factor.\n\n' +
        '**Conservation genetics** adds another concern. With only ~260 individuals descended from a bottleneck of ~100, genetic diversity has been severely reduced. Inbreeding depression (reduced immune function, lower fertility, higher calf mortality) may further suppress population growth even if habitat improves.\n\n' +
        '| Genetic metric | Healthy population | Sangai (estimated) |\n' +
        '|---------------|-------------------|--------------------|\n' +
        '| Heterozygosity | 0.60–0.80 | 0.35–0.45 |\n' +
        '| Effective population size (N_e) | > 500 | 40–80 |\n' +
        '| Inbreeding coefficient (F) | < 0.05 | 0.10–0.20 |\n\n' +
        'An N_e below 50 risks serious inbreeding depression; below 500, long-term adaptive potential is lost. The sangai is in the danger zone on both counts.',
      advancedContent:
        '**Population viability analysis (PVA)** for the sangai uses stochastic simulation (e.g., Vortex software) to estimate extinction probability under different management scenarios:\n\n' +
        '| Scenario | Phumdi quality | Poaching | N in 50 years | P(extinction in 100 yr) |\n' +
        '|---------|---------------|---------|--------------|------------------------|\n' +
        '| Status quo | Moderate, variable | Low | 180–320 | 15–25% |\n' +
        '| Barrage removal | Restored natural cycle | Low | 350–500 | < 5% |\n' +
        '| Barrage + climate change | Degraded further | Low | 80–150 | 40–60% |\n' +
        '| Captive breeding + habitat | Supplemented | Low | 300–450 | < 10% |\n\n' +
        'The analysis reveals that **habitat restoration** (managing water levels) is far more effective than captive breeding alone. Even aggressive captive breeding cannot overcome continuing habitat degradation — you can breed deer, but you cannot breed phumdis.\n\n' +
        '**Metapopulation theory** suggests that establishing a second population in a separate location would dramatically reduce extinction risk. Candidate sites must have:\n\n' +
        '| Requirement | Reason | Status |\n' +
        '|------------|--------|--------|\n' +
        '| Floating phumdi habitat | Species-specific adaptation | No equivalent site identified globally |\n' +
        '| Protected area status | Prevent encroachment, hunting | Can be established |\n' +
        '| Genetic management plan | Avoid founder effects | Requires careful selection of founding individuals |\n' +
        '| Community support | Local buy-in essential | Meitei cultural connection to sangai is strong |\n\n' +
        'The absence of any other phumdi habitat worldwide makes the sangai an extreme case of **habitat dependency** — there is no Plan B location. This underscores why protecting Loktak\'s phumdi ecosystem is not optional but existential for the species.',
    },

    // ── Section 7: Human Impacts on Habitats ──────────────────
    {
      title: 'Human Impacts and Dam Effects',
      diagram: 'LoktakDamImpactDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each human activity to its habitat impact',
          pairs: [
            ['Dam construction', 'Alters water levels, blocks fish migration, changes flood cycles'],
            ['Deforestation for agriculture', 'Fragments habitat, increases erosion, reduces biodiversity'],
            ['Invasive species introduction', 'Outcompetes natives for resources, alters food webs'],
            ['Urbanisation near wetlands', 'Fills edges, increases pollution runoff, disrupts hydrology'],
            ['Overfishing', 'Removes key species, disrupts trophic cascades'],
          ],
        },
      },
      beginnerContent:
        'Humans reshape habitats faster than any natural force. Some changes are intentional (clearing forest for farming), others are side effects (pollution from factories), and some are well-meaning projects with unintended consequences — like the Ithai Barrage on Loktak Lake.\n\n' +
        '**Explore the diagram above** — it shows how dam construction changes an entire ecosystem, from water levels to wildlife.\n\n' +
        '| Human activity | Direct impact | Cascade effect | Recovery time |\n' +
        '|---------------|-------------|----------------|---------------|\n' +
        '| Forest clearing | Removes trees, exposes soil | Erosion → river siltation → fish decline | 50–200 years (if left alone) |\n' +
        '| Dam / barrage | Alters water level and flow | Wetland degradation → species loss | Irreversible without removal |\n' +
        '| Pesticide use | Kills target pests | Bioaccumulation → raptor decline (DDT story) | Decades after ban |\n' +
        '| Road construction | Fragments habitat | Roadkill, noise, light pollution, barrier effect | Permanent unless bridged |\n' +
        '| Water hyacinth invasion | Covers water surface | Blocks light, deoxygenates water, kills fish | Ongoing management needed |\n\n' +
        'The **cascade effect** is critical to understand. Cutting trees doesn\'t just remove trees — exposed soil washes into rivers, increasing turbidity. Fish that hunt by sight can\'t find prey. Fish populations drop. Birds that eat fish lose their food source. The original action (tree cutting) ripples through the food web like dominoes.\n\n' +
        '**Worked example — the Ithai Barrage cascade:**\n' +
        '1. Barrage built (1983) → water level in Loktak Lake rises\n' +
        '2. Higher water → phumdi mats thin and fragment\n' +
        '3. Thin phumdis → sangai deer can\'t walk safely → population crashes\n' +
        '4. Stagnant water → oxygen drops → fish diversity declines\n' +
        '5. Fishers catch less → economic pressure → encroachment on lake edges\n' +
        '6. Encroachment → further habitat loss → feedback loop\n\n' +
        '| Before barrage (pre-1983) | After barrage (post-1983) |\n' +
        '|--------------------------|-------------------------|\n' +
        '| Natural water level fluctuation | Permanently elevated water |\n' +
        '| Thick, stable phumdis (1.5–2 m) | Thin, fragile phumdis (0.5–1 m) |\n' +
        '| ~500 sangai deer | Population crashed to ~100 |\n' +
        '| Rich fish diversity | Reduced fish species, oxygen stress |\n' +
        '| Self-sustaining ecosystem | Requires active management to survive |',
      intermediateContent:
        '**Environmental Impact Assessment (EIA)** is the process meant to catch these cascades *before* a project is built. In India, the Environmental Protection Act (1986) and EIA Notification (2006) require assessments for large projects.\n\n' +
        '| EIA stage | Purpose | Common weakness |\n' +
        '|-----------|--------|----------------|\n' +
        '| **Screening** | Determine if full EIA needed | Projects split to avoid thresholds |\n' +
        '| **Scoping** | Identify key issues to assess | Critical impacts overlooked |\n' +
        '| **Baseline study** | Document current environment | Too brief, wrong season, biased |\n' +
        '| **Impact prediction** | Model future impacts | Cumulative effects ignored |\n' +
        '| **Mitigation** | Propose measures to reduce harm | Paper promises, weak enforcement |\n' +
        '| **Public hearing** | Community input | Poorly advertised, technical jargon |\n' +
        '| **Monitoring** | Verify predictions post-construction | Rarely done rigorously |\n\n' +
        'The Ithai Barrage was built before modern EIA requirements. Retrospective analysis shows that a thorough EIA would have flagged phumdi thinning, sangai habitat loss, and fishery decline as high-probability impacts — potentially leading to alternative designs (e.g., run-of-river power with fish ladders, seasonal water level management).\n\n' +
        '**Cumulative impact** is the EIA\'s blind spot. A single small dam may have minor effects. But the Brahmaputra basin faces proposals for 160+ hydroelectric projects across India, China, and Bhutan. Each dam individually may pass EIA review, but their cumulative effect on sediment transport, flood pulses, fish migration, and downstream floodplain habitats could be devastating.\n\n' +
        '| Individual dam effect | Cumulative effect (multiple dams) |\n' +
        '|----------------------|----------------------------------|\n' +
        '| Traps 10–30% of sediment | 60–90% sediment trapped → floodplain starved of nutrients |\n' +
        '| Delays flood peak by days | Flood pulse timing disrupted → fish breeding failure |\n' +
        '| Blocks one fish run | Multiple barriers → complete migration route severed |\n' +
        '| Minor water temperature change | Significant thermal regime alteration |',
      advancedContent:
        '**Flow-ecology relationships** quantify how changes in river flow regimes affect ecological outcomes. The **Indicators of Hydrologic Alteration (IHA)** framework (Richter et al., 1996) uses 33 parameters grouped into five categories:\n\n' +
        '| IHA group | Parameters | Ecological relevance |\n' +
        '|-----------|-----------|---------------------|\n' +
        '| Magnitude of monthly flows | 12 monthly means | Habitat availability, water quality |\n' +
        '| Magnitude of extreme flows | 1, 3, 7, 30, 90-day min/max | Disturbance, drought stress |\n' +
        '| Timing of extremes | Julian date of annual min/max | Life cycle synchronisation |\n' +
        '| Frequency and duration | High/low pulse count and duration | Floodplain connectivity |\n' +
        '| Rate of change | Rise/fall rates, reversals | Organism stranding, bank stability |\n\n' +
        '**Environmental flows (e-flows)** define the water regime needed to maintain a river ecosystem in a desired state. Methods range from simple (percentage of mean annual flow) to complex (holistic frameworks):\n\n' +
        '| E-flow method | Complexity | Data needs | Recommendation quality |\n' +
        '|-------------|-----------|-----------|----------------------|\n' +
        '| Tennant (Montana) | Low | Mean annual flow only | Crude — single percentage |\n' +
        '| DRIFT | High | Hydrology, hydraulics, biology | Scenario-based, rigorous |\n' +
        '| ELOHA | High | Regional flow–ecology relationships | Scalable to ungauged rivers |\n' +
        '| Building Block | High | Expert panel + data | Prescribes monthly flow targets |\n\n' +
        'For a dammed river system, the key question is: what flow releases from the dam maintain downstream habitat? The answer must balance human water needs (irrigation, power, drinking water) with ecological requirements — a multi-objective optimisation problem that uses Pareto-front analysis to identify trade-off curves between economic and ecological objectives.',
    },

    // ── Section 8: Building a Wetland — Hands On ──────────────
    {
      title: 'Activity: Model a Wetland Ecosystem',
      diagram: 'ActivityWetlandModelDiagram',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'You can build a functioning mini-wetland in a plastic tub that filters muddy water in under 48 hours — proof that nature\'s water treatment works at any scale.',
            'Schools in Assam have built classroom wetland models that demonstrate flood buffering, filtration, and habitat creation using only soil, gravel, and local pond plants.',
            'NASA uses constructed wetlands to treat wastewater at Kennedy Space Center — the same principles that work in Loktak work in space programs.',
          ],
        },
      },
      beginnerContent:
        'The best way to understand wetlands is to **build one**. This activity guides you through creating a mini-wetland in a container — a working model that demonstrates filtration, habitat layering, and nutrient cycling.\n\n' +
        '**Materials needed:**\n\n' +
        '| Material | Purpose | Alternative |\n' +
        '|---------|--------|------------|\n' +
        '| Large plastic tub (50+ litres) | Container | Old bathtub, concrete trough |\n' +
        '| Gravel (2–3 kg) | Drainage layer | Broken bricks, pebbles from a stream |\n' +
        '| Sand (2–3 kg) | Filtration layer | Any clean sand |\n' +
        '| Garden soil (5–10 kg) | Planting substrate | Soil from a rice paddy is ideal |\n' +
        '| Pond water (not tap water) | Microbial community | Water from any natural pond |\n' +
        '| Local aquatic plants | Vegetation | Water hyacinth, duckweed, sedges |\n\n' +
        '**Steps:**\n' +
        '1. Layer gravel (5 cm) → sand (5 cm) → soil (10 cm) in the tub\n' +
        '2. Create one deep end (pond zone) and one shallow end (marsh zone) by sloping the soil\n' +
        '3. Add pond water slowly to avoid disturbing layers — fill to just above soil in the shallow end\n' +
        '4. Plant aquatic plants in the shallow zone; float duckweed in the deep zone\n' +
        '5. Wait 48 hours for the microbial community to establish\n' +
        '6. **Test it:** Pour a cup of muddy water into one end. Watch the other end — within hours, water emerging from the gravel-sand layers will be clearer\n\n' +
        '**What to observe over 2 weeks:**\n\n' +
        '| Day | What to look for | What it teaches |\n' +
        '|-----|-----------------|----------------|\n' +
        '| 1–2 | Water clears gradually | Physical filtration through sand/gravel |\n' +
        '| 3–5 | Green algae may appear | Nutrients in soil fuel primary production |\n' +
        '| 5–10 | Insect larvae, tiny organisms appear | Colonisation — life finds habitat |\n' +
        '| 10–14 | Plant roots spread, water stays clear | Biological filtration established |\n' +
        '| 14+ | Stable mini-ecosystem | Your wetland is self-sustaining |\n\n' +
        'This model demonstrates the same principles that make Deepor Beel filter Guwahati\'s water and Loktak\'s phumdis support an entire ecosystem — just at tabletop scale.',
      intermediateContent:
        '**Quantifying your wetland\'s performance:**\n\n' +
        'To turn this from a demonstration into a science experiment, measure before-and-after water quality:\n\n' +
        '| Parameter | How to measure | Expected change | Why |\n' +
        '|-----------|---------------|----------------|-----|\n' +
        '| **Turbidity** | Secchi disc (or ruler visibility depth) | 80–95% reduction | Physical filtration |\n' +
        '| **pH** | pH test strips (₹50 from a pharmacy) | May shift toward neutral | Buffering by soil carbonates |\n' +
        '| **Nitrate** | Aquarium test kit | 40–70% reduction | Plant uptake + denitrification |\n' +
        '| **Dissolved oxygen** | Aquarium DO kit | Should increase | Photosynthesis by plants and algae |\n' +
        '| **Temperature** | Thermometer | 1–3°C cooler than ambient | Evaporative cooling, shading |\n\n' +
        '**Experimental design:** Build two tubs — one with plants (treatment), one without (control). Pour identical muddy water into both. Measure turbidity daily for 14 days. The difference is the **biological filtration effect** — the value that living organisms add beyond simple sand filtration.\n\n' +
        '**Scaling up:** If a 0.5 m² tabletop wetland reduces nitrate by 50%, how large a wetland would you need to treat wastewater from a village of 500 people?\n\n' +
        '| Design parameter | Value |\n' +
        '|-----------------|-------|\n' +
        '| Wastewater per person | ~100 litres/day |\n' +
        '| Total daily volume | 50,000 litres |\n' +
        '| Hydraulic retention time | 5–7 days |\n' +
        '| Required wetland volume | 250,000–350,000 litres |\n' +
        '| At 0.5 m depth | **500–700 m²** (about the size of 2–3 tennis courts) |\n\n' +
        'This is a real-world engineering calculation. Constructed wetlands of exactly this size operate successfully in villages across India.',
      advancedContent:
        '**Wetland biogeochemistry — the nitrogen cycle in detail:**\n\n' +
        'Nitrogen removal is the most valuable biochemical service a wetland provides. The process involves multiple microbial transformations:\n\n' +
        '| Process | Organism | Conditions | Reaction |\n' +
        '|---------|---------|-----------|----------|\n' +
        '| **Ammonification** | Heterotrophic bacteria | Aerobic or anaerobic | Organic N → NH₄⁺ |\n' +
        '| **Nitrification** | *Nitrosomonas*, *Nitrobacter* | Aerobic only | NH₄⁺ → NO₂⁻ → NO₃⁻ |\n' +
        '| **Denitrification** | *Pseudomonas*, others | Anaerobic only | NO₃⁻ → N₂O → **N₂** (gas) |\n' +
        '| **Anammox** | *Candidatus Brocadia* | Anaerobic | NH₄⁺ + NO₂⁻ → **N₂** |\n' +
        '| **Plant uptake** | Wetland plants | Growing season | NH₄⁺ or NO₃⁻ → plant biomass |\n\n' +
        'The key insight: **nitrification requires oxygen, denitrification requires its absence**. Wetlands naturally create both conditions — aerobic zones around plant roots (the rhizosphere) and anaerobic zones in waterlogged soil just millimetres away. This spatial heterogeneity at the millimetre scale is what makes wetlands so effective at nitrogen removal.\n\n' +
        '**First-order kinetics model** for pollutant removal in constructed wetlands:\n\n' +
        '`C_out = C_in × e^(-k × t)`\n\n' +
        'Where C_out = outlet concentration, C_in = inlet concentration, k = removal rate constant, t = hydraulic retention time.\n\n' +
        '| Pollutant | k (per day) | t for 90% removal |\n' +
        '|-----------|-----------|-------------------|\n' +
        '| BOD | 0.15–0.30 | 8–15 days |\n' +
        '| TSS | 0.20–0.50 | 5–12 days |\n' +
        '| NH₄-N | 0.05–0.15 | 15–46 days |\n' +
        '| Total N | 0.03–0.10 | 23–77 days |\n' +
        '| Total P | 0.02–0.05 | 46–115 days |\n\n' +
        'Phosphorus is the hardest to remove because, unlike nitrogen, there is no gaseous pathway — it must be physically adsorbed onto soil particles or taken up by plants, which must then be harvested. This is why constructed wetlands often include a gravel bed with high iron or aluminium content to enhance phosphorus adsorption.',
    },
  ],
};
