import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'ecosystems-and-biomes',
  title: 'Ecosystems & Biomes',
  category: 'ecology',
  icon: '🌿',
  tagline: 'Energy flows, nutrients cycle, and biomes from Kaziranga grasslands to Himalayan alpine meadows.',
  relatedStories: ['kaziranga-grass', 'elephant-corridor', 'girl-grew-forest', 'dancing-deer-of-loktak-lake'],
  understand: [
    // ── Section 1: Energy Flow ─────────────────────────────────
    {
      title: 'Energy Flow Through Ecosystems',
      diagram: 'EnergyPyramidDiagram',
      beginnerContent:
        'Every ecosystem runs on a single power source: **the Sun**. But sunlight doesn\'t reach animals directly. It passes through a chain of living things, losing energy at every step.\n\n' +
        'Think of it like a relay race where each runner drops 90% of the baton\'s contents before passing it on. By the fourth runner, almost nothing is left.\n\n' +
        '**The trophic levels:**\n\n' +
        '| Level | Role | Examples | Energy available |\n' +
        '|-------|------|---------|------------------|\n' +
        '| 1 — Producers | Capture sunlight via photosynthesis | Grasses, algae, phytoplankton | 100% (base) |\n' +
        '| 2 — Primary consumers | Eat producers | Rhinos, deer, grasshoppers, zooplankton | ~10% |\n' +
        '| 3 — Secondary consumers | Eat herbivores | Tigers, frogs, small fish | ~1% |\n' +
        '| 4 — Tertiary consumers | Top predators | Eagles, large sharks | ~0.1% |\n' +
        '| All levels — Decomposers | Break down dead matter | Fungi, bacteria, earthworms | Recycle nutrients |\n\n' +
        '**Why only 10%?** When a one-horned rhino eats 50 kg of tall elephant grass, roughly 90% of the energy in that grass was already used by the grass itself (for growth, respiration) or is lost as heat during the rhino\'s digestion and movement. Only about 10% becomes new rhino body mass — muscle, fat, bone. This is the **10% rule**.\n\n' +
        '**Worked example — Kaziranga energy budget:**\n\n' +
        '| Trophic level | Energy (kJ/m²/year) | Calculation |\n' +
        '|---------------|--------------------|--------------|\n' +
        '| Grass (producers) | 40,000 | Captured from sunlight |\n' +
        '| Rhinos, deer (herbivores) | 4,000 | 40,000 × 10% |\n' +
        '| Tigers (carnivores) | 400 | 4,000 × 10% |\n' +
        '| Scavengers/parasites | 40 | 400 × 10% |\n\n' +
        'This is why food chains rarely exceed 4–5 links — there simply isn\'t enough energy left for another level. It also explains why a single Bengal tiger needs a home range of 20–100 km²: the prey density, itself limited by plant productivity, can only support so many predators.\n\n' +
        '**Quick check:** A grassland produces 10,000 kJ/m²/year. How much energy is available to a hawk that eats snakes that eat mice that eat seeds?\n\n' +
        '*Answer: 10,000 × 0.1 × 0.1 × 0.1 = **10 kJ/m²/year** — just 0.1% of the original.*',
      intermediateContent:
        '**Measuring productivity:**\n\n' +
        'Ecologists quantify energy flow using productivity metrics:\n\n' +
        '| Metric | Definition | Unit |\n' +
        '|--------|-----------|------|\n' +
        '| **GPP** (Gross Primary Productivity) | Total energy fixed by photosynthesis | g C/m²/year |\n' +
        '| **NPP** (Net Primary Productivity) | GPP minus plant respiration | g C/m²/year |\n' +
        '| **NEP** (Net Ecosystem Productivity) | NPP minus all heterotrophic respiration | g C/m²/year |\n\n' +
        'NPP varies enormously across ecosystems:\n\n' +
        '| Ecosystem | NPP (g C/m²/year) | Why |\n' +
        '|-----------|-------------------|-----|\n' +
        '| Tropical rainforest | 1,000–2,000 | Warm, wet, year-round sunlight |\n' +
        '| Tropical grassland (e.g., Kaziranga) | 1,500–2,000 | Monsoon flooding brings nutrients |\n' +
        '| Temperate forest | 600–1,200 | Seasonal limitation |\n' +
        '| Open ocean | 50–200 | Nutrient-poor surface waters |\n' +
        '| Desert | < 50 | Water-limited |\n\n' +
        '**Lindeman efficiency** (trophic transfer efficiency) averages 10% but varies by organism type:\n\n' +
        '| Organism type | Efficiency | Reason |\n' +
        '|---------------|-----------|--------|\n' +
        '| Endotherms (mammals, birds) | 1–3% | Most energy maintains body temperature |\n' +
        '| Ectotherms (insects, reptiles) | 10–15% | Don\'t regulate body temperature |\n' +
        '| Aquatic invertebrates | 15–25% | Cold water, minimal movement costs |\n\n' +
        'This is why insect biomass vastly exceeds mammal biomass in any ecosystem. An **ecological pyramid of numbers** can be inverted (one tree supports millions of insects), but the **pyramid of energy is never inverted** — energy always decreases up trophic levels.',
      advancedContent:
        '**Ecosystem energetics modelling:**\n\n' +
        'Modern ecologists use **compartment models** that track carbon and energy fluxes between pools (atmosphere, producers, herbivores, carnivores, detritus, soil). Satellite-derived **NDVI** (Normalised Difference Vegetation Index) estimates NPP globally by measuring the ratio of near-infrared to red reflectance from vegetation canopies.\n\n' +
        '| Remote sensing index | Formula | Measures |\n' +
        '|---------------------|---------|----------|\n' +
        '| NDVI | (NIR − Red) / (NIR + Red) | Vegetation greenness/density |\n' +
        '| EVI | Enhanced Vegetation Index | Corrects for soil/atmosphere effects |\n' +
        '| GPP models | NDVI × PAR × ε | Estimates carbon fixation |\n\n' +
        'The **metabolic theory of ecology** (Brown et al., 2004) predicts that NPP scales with body size and temperature:\n\n' +
        '`NPP ∝ M^(3/4) · e^(−Ea / kT)`\n\n' +
        'where M = body mass, Ea = activation energy (~0.65 eV), k = Boltzmann constant, T = temperature in Kelvin. This links individual metabolism to ecosystem-level energy flow.\n\n' +
        '**Eddy covariance towers** measure real-time CO₂ and water vapour exchange between ecosystems and the atmosphere using high-frequency wind and gas sensors mounted above the canopy. Towers in tea plantations and forest sites across the Eastern Himalayas are quantifying how land-use change alters regional carbon budgets — data critical for India\'s Nationally Determined Contributions under the Paris Agreement.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each trophic level to its role in the ecosystem',
          pairs: [
            ['Producers', 'Convert sunlight to chemical energy via photosynthesis — grasses, algae, trees'],
            ['Primary consumers', 'Herbivores that eat producers — rhinos, deer, caterpillars'],
            ['Secondary consumers', 'Predators that eat herbivores — tigers, frogs, spiders'],
            ['Decomposers', 'Break down dead matter, returning nutrients to the soil — fungi, bacteria'],
          ],
        },
      },
    },

    // ── Section 2: The Carbon Cycle ────────────────────────────
    {
      title: 'The Carbon Cycle',
      diagram: 'CarbonCycleDiagram',
      beginnerContent:
        'Carbon is the skeleton of life. Every protein, fat, carbohydrate, and DNA molecule contains carbon atoms. The **carbon cycle** describes how these atoms circulate through the atmosphere, living organisms, the ocean, and the Earth\'s crust — endlessly recycled, never created or destroyed.\n\n' +
        'Think of the carbon cycle as a bank account. Photosynthesis is a **deposit** (carbon moves from air into plants). Respiration and burning are **withdrawals** (carbon returns to the air). When deposits and withdrawals balance, the atmospheric "account" stays stable.\n\n' +
        '**The major carbon moves:**\n\n' +
        '| Process | Direction | Amount (billion tonnes C/year) |\n' +
        '|---------|-----------|-------------------------------|\n' +
        '| Photosynthesis | Atmosphere → plants | ~120 |\n' +
        '| Plant & animal respiration | Living things → atmosphere | ~119 |\n' +
        '| Ocean absorption | Atmosphere → ocean | ~2.5 |\n' +
        '| Fossil fuel burning | Underground → atmosphere | ~10 |\n' +
        '| Deforestation | Forests → atmosphere | ~1.5 |\n\n' +
        'For millions of years, photosynthesis and respiration roughly balanced. Forests absorbed CO₂ and released it when they decayed. Oceans absorbed and released CO₂ with the seasons.\n\n' +
        '**Then humans tipped the balance.** Burning fossil fuels releases carbon that was locked underground for 300–400 million years. Deforestation removes trees that would absorb CO₂. The result:\n\n' +
        '| Period | Atmospheric CO₂ (ppm) | Change |\n' +
        '|--------|----------------------|--------|\n' +
        '| Pre-industrial (1750) | ~280 | Baseline |\n' +
        '| 1960 (Keeling curve begins) | ~315 | +12.5% |\n' +
        '| 2000 | ~370 | +32% |\n' +
        '| 2025 | ~425 | +52% |\n\n' +
        'This extra CO₂ traps heat in the atmosphere (the greenhouse effect), driving climate change. The Brahmaputra valley is already seeing shifting monsoon patterns, more intense floods, and rising temperatures that stress grassland ecosystems and the species — from rhinos to river dolphins — that depend on them.\n\n' +
        '**The good news:** Forests, wetlands, and soils are powerful **carbon sinks**. Protecting existing forests and restoring degraded ones draws carbon back out of the atmosphere. Mangroves in the Sundarbans, peat bogs in Meghalaya, and the vast floodplain grasslands of Assam all sequester significant carbon — giving them value far beyond their biodiversity.',
      intermediateContent:
        '**Carbon reservoirs and residence times:**\n\n' +
        'Not all carbon pools cycle at the same speed:\n\n' +
        '| Reservoir | Carbon stored (Gt C) | Residence time |\n' +
        '|-----------|---------------------|----------------|\n' +
        '| Atmosphere | ~870 | ~5 years (per molecule) |\n' +
        '| Terrestrial vegetation | ~450 | Decades |\n' +
        '| Soils | ~1,500 | Centuries to millennia |\n' +
        '| Oceans (dissolved) | ~38,000 | Centuries |\n' +
        '| Fossil fuels | ~10,000 | Millions of years |\n' +
        '| Sedimentary rocks | ~65,000,000 | Hundreds of millions |\n\n' +
        '**The ocean carbon pump:**\n\n' +
        'CO₂ dissolves in seawater, forming carbonic acid (H₂CO₃), which dissociates into bicarbonate (HCO₃⁻) and hydrogen ions (H⁺). This is why rising CO₂ makes oceans more acidic:\n\n' +
        '`CO₂ + H₂O → H₂CO₃ → H⁺ + HCO₃⁻`\n\n' +
        'Ocean pH has dropped from 8.2 to 8.1 since pre-industrial times — a 30% increase in acidity (pH is logarithmic). This dissolves the calcium carbonate shells of corals, molluscs, and plankton.\n\n' +
        '**Worked example — a forest\'s carbon budget:**\n\n' +
        'A 1-hectare patch of semi-evergreen forest in the Karbi Anglong hills:\n\n' +
        '| Component | Carbon stored (tonnes C/ha) |\n' +
        '|-----------|---------------------------|\n' +
        '| Above-ground biomass (trunks, branches, leaves) | 120 |\n' +
        '| Below-ground biomass (roots) | 30 |\n' +
        '| Soil organic carbon (top 1 m) | 80 |\n' +
        '| Litter and deadwood | 15 |\n' +
        '| **Total** | **245** |\n\n' +
        'If this hectare is cleared and burned, most of those 245 tonnes return to the atmosphere — equivalent to the annual emissions of about 50 cars.',
      advancedContent:
        '**Isotopic tracers in carbon cycle research:**\n\n' +
        'Carbon exists as three isotopes: ¹²C (98.9%), ¹³C (1.1%), and ¹⁴C (trace, radioactive). Each behaves slightly differently:\n\n' +
        '| Isotope | Use in research | Key insight |\n' +
        '|---------|----------------|-------------|\n' +
        '| ¹³C/¹²C ratio (δ¹³C) | Distinguishes C3 vs C4 photosynthesis | Fossil fuels are ¹³C-depleted; atmospheric δ¹³C is falling → confirms fossil origin |\n' +
        '| ¹⁴C (radiocarbon) | Dating old carbon | Fossil carbon has zero ¹⁴C (decayed over millions of years) |\n' +
        '| ¹⁴C "bomb spike" | Tracking post-1950 carbon flow | Nuclear tests doubled atmospheric ¹⁴C; traced through oceans and soils |\n\n' +
        '**Earth System Models (ESMs)** couple carbon cycle models with climate models to predict feedback loops:\n\n' +
        '- **Positive feedback:** Warming → permafrost thaws → releases stored CH₄ and CO₂ → more warming\n' +
        '- **Positive feedback:** Warming → soil respiration increases → releases more CO₂ → more warming\n' +
        '- **Negative feedback:** More CO₂ → CO₂ fertilisation → plants grow faster → absorb more CO₂\n\n' +
        'The net effect of these feedbacks determines the **climate sensitivity** — how much warming results from doubling CO₂. Current estimates: 2.5–4.0°C per doubling, with feedbacks contributing roughly 50% of total warming.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Photosynthesis removes carbon from the atmosphere.', answer: true, explanation: 'Plants absorb CO₂ from the atmosphere and incorporate the carbon into glucose and other organic molecules during photosynthesis.' },
            { text: 'The ocean releases more CO₂ than it absorbs.', answer: false, explanation: 'The ocean is currently a net carbon sink, absorbing about 2.5 billion tonnes more carbon per year than it releases. This absorption is making the oceans more acidic.' },
            { text: 'Burning fossil fuels releases carbon that was stored underground for millions of years.', answer: true, explanation: 'Fossil fuels (coal, oil, gas) are the remains of organisms buried 300-400 million years ago. Burning them releases this ancient carbon into today\'s atmosphere.' },
            { text: 'Soil contains more carbon than all living plants combined.', answer: true, explanation: 'Soils hold roughly 1,500 Gt of carbon — more than three times the amount in all terrestrial vegetation (~450 Gt). Soil carbon comes from centuries of accumulated dead roots, leaves, and microbial remains.' },
          ],
        },
      },
    },

    // ── Section 3: The Nitrogen Cycle ──────────────────────────
    {
      title: 'The Nitrogen Cycle',
      diagram: 'NitrogenCycleDiagram',
      beginnerContent:
        'Nitrogen is in every protein and every strand of DNA in your body. The atmosphere is 78% nitrogen gas (N₂). Yet plants can\'t use N₂ directly — the two nitrogen atoms are bonded so tightly (a triple bond) that most living things can\'t break them apart.\n\n' +
        'Think of atmospheric nitrogen as a locked vault full of gold coins. The coins are everywhere, but you need a special key to unlock the vault. Only certain bacteria have that key.\n\n' +
        '**The five steps of the nitrogen cycle:**\n\n' +
        '| Step | What happens | Key organisms |\n' +
        '|------|-------------|---------------|\n' +
        '| **1. Fixation** | N₂ → NH₃ (ammonia) | *Rhizobium* (in legume root nodules), *Azotobacter* (free in soil), lightning |\n' +
        '| **2. Nitrification** | NH₃ → NO₂⁻ → NO₃⁻ (nitrate) | *Nitrosomonas*, *Nitrobacter* |\n' +
        '| **3. Assimilation** | Plants absorb NO₃⁻ through roots | All plants |\n' +
        '| **4. Ammonification** | Dead organisms → NH₃ | Decomposer fungi and bacteria |\n' +
        '| **5. Denitrification** | NO₃⁻ → N₂ (back to atmosphere) | *Pseudomonas* (in waterlogged soils) |\n\n' +
        '**Why do farmers rotate rice with lentils?**\n\n' +
        'Rice pulls nitrogen from the soil but doesn\'t replace it. Lentils (and other legumes like black gram) have *Rhizobium* bacteria in their root nodules that fix atmospheric N₂ into ammonia — literally fertilising the soil for free. After a season of lentils, the soil is nitrogen-enriched and ready for another rice crop. This ancient rotation practice, common across the Brahmaputra floodplain, is exactly what modern soil science recommends.\n\n' +
        '**Worked example — nitrogen in a rice paddy:**\n\n' +
        '| Nitrogen input | Amount (kg N/ha/year) |\n' +
        '|---------------|----------------------|\n' +
        '| Biological fixation (blue-green algae in flooded fields) | 20–30 |\n' +
        '| Rhizobium from previous legume crop | 30–50 |\n' +
        '| Atmospheric deposition (rain) | 5–10 |\n' +
        '| Synthetic fertiliser (if used) | 60–120 |\n' +
        '| **Total input** | **115–210** |\n' +
        '| Rice crop uptake | 80–120 |\n' +
        '| Lost to denitrification (waterlogged soil) | 20–40 |\n' +
        '| Lost to runoff | 10–30 |\n\n' +
        'In waterlogged paddies, denitrifying bacteria thrive in the oxygen-poor mud, converting up to 30% of applied fertiliser back into N₂ gas — expensive waste for farmers and a reason why traditional biological nitrogen fixation is often more efficient than dumping synthetic fertiliser.',
      intermediateContent:
        '**The Haber-Bosch process — humanity\'s biggest chemical intervention:**\n\n' +
        'In 1909, Fritz Haber figured out how to break the N₂ triple bond industrially:\n\n' +
        '`N₂ + 3H₂ → 2NH₃` (at 400–500°C, 150–300 atm, iron catalyst)\n\n' +
        'This single reaction changed the world:\n\n' +
        '| Before Haber-Bosch (pre-1910) | After Haber-Bosch |\n' +
        '|-------------------------------|--------------------|\n' +
        '| All nitrogen from biological fixation + manure | Synthetic fertiliser feeds ~50% of world population |\n' +
        '| Global population ~1.7 billion | Population grew to 8 billion |\n' +
        '| Crop yields limited by nitrogen | Yields tripled in many regions |\n' +
        '| No nitrogen pollution | Excess nitrogen pollutes rivers, creates dead zones |\n\n' +
        '**The dark side of excess nitrogen:**\n\n' +
        '| Problem | Mechanism | Example |\n' +
        '|---------|-----------|--------|\n' +
        '| Eutrophication | Nitrogen runoff → algal bloom → algae die → decomposition uses all oxygen → fish die | Dead zones in the Brahmaputra tributaries |\n' +
        '| Nitrous oxide (N₂O) | Denitrification of excess nitrate | 300× more potent greenhouse gas than CO₂ |\n' +
        '| Groundwater contamination | Nitrate leaches into wells | Health risk: methemoglobinemia (blue baby syndrome) |\n' +
        '| Acid rain | NOₓ from fertiliser and combustion | Damages forests and soil pH |\n\n' +
        'The **nitrogen cascade** describes how a single atom of reactive nitrogen can trigger multiple environmental problems as it moves through air, water, and soil before finally being denitrified back to harmless N₂.',
      advancedContent:
        '**Nitrogenase — the enzyme that does what industry needs 500°C to achieve:**\n\n' +
        'The nitrogenase enzyme complex consists of two proteins:\n\n' +
        '| Component | Structure | Role |\n' +
        '|-----------|-----------|------|\n' +
        '| Fe protein (dinitrogenase reductase) | Homodimer with [4Fe-4S] cluster | Electron donor — uses ATP hydrolysis |\n' +
        '| MoFe protein (dinitrogenase) | α₂β₂ tetramer with FeMo-cofactor | Active site — binds and reduces N₂ |\n\n' +
        'The reaction: `N₂ + 8H⁺ + 8e⁻ + 16ATP → 2NH₃ + H₂ + 16ADP + 16Pi`\n\n' +
        'Each N₂ molecule requires **16 ATP** — an enormous energy cost, which is why nitrogen-fixing bacteria demand ~20% of the plant\'s photosynthetic output in return. Nitrogenase is irreversibly destroyed by oxygen, so *Rhizobium* root nodules produce **leghemoglobin** — a red, oxygen-binding protein (analogous to animal hemoglobin) that keeps the nodule interior at very low O₂ levels.\n\n' +
        '**The global nitrogen budget is now dominated by human activity:**\n\n' +
        '| Source | Reactive N created (Tg N/year) |\n' +
        '|--------|-------------------------------|\n' +
        '| Natural biological fixation (terrestrial) | ~58 |\n' +
        '| Natural biological fixation (marine) | ~140 |\n' +
        '| Lightning | ~5 |\n' +
        '| **Haber-Bosch (industrial)** | **~120** |\n' +
        '| **Fossil fuel combustion** | **~30** |\n' +
        '| **Biological N fixation in agriculture** | **~60** |\n\n' +
        'Humans now produce more reactive nitrogen than all natural terrestrial processes combined — a planetary boundary that several Earth-system scientists argue we have already exceeded.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each nitrogen cycle step to the correct transformation',
          pairs: [
            ['Nitrogen fixation', 'N₂ gas is converted to ammonia (NH₃) by bacteria or lightning'],
            ['Nitrification', 'Ammonia is oxidised to nitrite and then nitrate by soil bacteria'],
            ['Assimilation', 'Plants absorb nitrate (NO₃⁻) through their roots to build proteins'],
            ['Denitrification', 'Nitrate is converted back to N₂ gas in waterlogged, oxygen-poor soils'],
          ],
        },
      },
    },

    // ── Section 4: Water Cycle & Nutrient Transport ────────────
    {
      title: 'The Water Cycle',
      diagram: 'WaterCycleDiagram',
      beginnerContent:
        'Water is the bloodstream of every ecosystem. It carries nutrients, shapes landscapes, and makes life possible. The same water molecules that fall as monsoon rain over the Brahmaputra today may have been part of a glacier, a cloud over the Pacific, or a dinosaur\'s drinking water millions of years ago.\n\n' +
        '**The water cycle has no beginning or end — it\'s a continuous loop:**\n\n' +
        '| Step | What happens | Scale |\n' +
        '|------|-------------|-------|\n' +
        '| **Evaporation** | Sun heats surface water → water becomes vapour | Oceans contribute ~86% of atmospheric moisture |\n' +
        '| **Transpiration** | Plants release water vapour through leaf pores (stomata) | A large sal tree transpires 200–400 litres/day |\n' +
        '| **Condensation** | Vapour cools at altitude → forms clouds | Clouds are billions of tiny water droplets |\n' +
        '| **Precipitation** | Water falls as rain, snow, hail | Cherrapunji receives ~11,777 mm/year |\n' +
        '| **Infiltration** | Water soaks into the ground → groundwater | Feeds wells, springs, and rivers in dry season |\n' +
        '| **Runoff** | Water flows over land into streams and rivers | The Brahmaputra carries ~20,000 m³/s in monsoon |\n\n' +
        '**Why forests matter for the water cycle:**\n\n' +
        'Forests act like giant sponges. Their canopy intercepts rain, slowing it down. Their roots hold soil, creating spaces for water to infiltrate. Their leaf litter absorbs moisture like a carpet. Remove the forest, and rain hits bare soil at full speed — causing erosion, flooding downstream, and dry wells in the dry season.\n\n' +
        '| With forest | Without forest |\n' +
        '|------------|----------------|\n' +
        '| Rain absorbed slowly, released over months | Rain runs off immediately |\n' +
        '| Streams flow year-round (baseflow) | Streams dry up between rains |\n' +
        '| Topsoil stays in place | Topsoil washes away (erosion) |\n' +
        '| Floods are dampened | Floods are sudden and severe |\n' +
        '| Groundwater recharges steadily | Wells dry up |\n\n' +
        'The Khasi Hills of Meghalaya receive some of the heaviest rainfall on Earth. Where sacred groves remain intact, streams flow year-round. Where forests have been cleared for mining or agriculture, landslides are common and dry-season water shortages occur — even in one of the wettest places on the planet.\n\n' +
        '**Quick check:** A village deforests a hillside to plant crops. What happens to the stream at the bottom during monsoon? During dry season?\n\n' +
        '*During monsoon: floods and muddy, sediment-laden water. During dry season: the stream dries up because no groundwater was stored.*',
      intermediateContent:
        '**Evapotranspiration — the hidden water pump:**\n\n' +
        'Plants don\'t just use water — they *move* it. A single hectare of tropical forest can transpire 20,000–40,000 litres per day. This process:\n\n' +
        '| Effect | Mechanism |\n' +
        '|--------|----------|\n' +
        '| Cools the local area | Evaporation absorbs latent heat (2,260 kJ/kg) |\n' +
        '| Creates "flying rivers" | Amazon transpiration generates 50% of its own rainfall |\n' +
        '| Drives nutrient uptake | Water moving up through roots carries dissolved minerals |\n\n' +
        '**Water budget equation:**\n\n' +
        '`P = ET + Q + ΔS`\n\n' +
        'Where P = precipitation, ET = evapotranspiration, Q = runoff, ΔS = change in storage (groundwater, soil moisture).\n\n' +
        '**Worked example — annual water budget for a forested catchment in Meghalaya:**\n\n' +
        '| Component | Amount (mm/year) | % of precipitation |\n' +
        '|-----------|-----------------|--------------------|\n' +
        '| Precipitation (P) | 10,000 | 100% |\n' +
        '| Evapotranspiration (ET) | 2,500 | 25% |\n' +
        '| Runoff (Q) | 7,200 | 72% |\n' +
        '| Groundwater recharge (ΔS) | 300 | 3% |\n\n' +
        'Even with extreme rainfall, 25% is returned to the atmosphere by the forest itself. If deforested, ET drops to ~15%, runoff surges to ~83%, and groundwater recharge drops — exactly the pattern observed in degraded Khasi Hills catchments.',
      advancedContent:
        '**Isotope hydrology — tracing water with atomic fingerprints:**\n\n' +
        'Water molecules containing heavier isotopes (²H, ¹⁸O) evaporate slightly slower and condense slightly faster than light water (¹H₂¹⁶O). This creates predictable patterns:\n\n' +
        '| Process | Effect on δ¹⁸O |\n' +
        '|---------|----------------|\n' +
        '| Evaporation from ocean | Vapour is isotopically light (negative δ¹⁸O) |\n' +
        '| Precipitation (rain-out) | Each rain event removes heavy isotopes → remaining vapour gets lighter |\n' +
        '| Higher altitude | Rain is lighter (more rain-out events) |\n' +
        '| Higher latitude | Same effect — progressive rain-out |\n' +
        '| Continental interior | More rain-out → very light precipitation |\n\n' +
        'The **Global Meteoric Water Line** (δ²H = 8 × δ¹⁸O + 10) relates hydrogen and oxygen isotope ratios in precipitation worldwide. Deviations from this line reveal evaporation, mixing with ancient groundwater, or geothermal heating.\n\n' +
        'In the Eastern Himalayas, isotope hydrology is used to determine what fraction of river flow comes from monsoon rain vs snowmelt vs groundwater — critical for predicting how glacier retreat will affect water supply in the Brahmaputra basin.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Most of Earth\'s fresh water is in rivers and lakes.', answer: false, explanation: 'Most fresh water (about 69%) is locked in glaciers and ice caps. Groundwater holds another 30%. Rivers and lakes contain less than 1% of all fresh water.' },
            { text: 'Trees release water vapour into the atmosphere through transpiration.', answer: true, explanation: 'Transpiration is the process by which water absorbed by roots moves up through the plant and evaporates from leaf pores (stomata). A large tree can transpire hundreds of litres per day.' },
            { text: 'Deforesting a hillside reduces flood risk downstream.', answer: false, explanation: 'Deforestation increases flood risk. Without tree roots and leaf litter to absorb rainfall, water runs off immediately, creating flash floods. Forests act as sponges that release water slowly.' },
            { text: 'Cherrapunji and Mawsynram receive heavy rainfall because moist air is forced upward by the Khasi Hills.', answer: true, explanation: 'This is orographic rainfall — moist air from the Bay of Bengal hits the steep southern face of the Khasi Hills, rises, cools, and dumps enormous amounts of rain.' },
          ],
        },
      },
    },

    // ── Section 5: Biomes & Ecological Zones ───────────────────
    {
      title: 'Biomes & Ecological Zones',
      diagram: 'NEIndiaBiomesDiagram',
      beginnerContent:
        'A **biome** is a large-scale ecosystem defined by its climate, soil, and characteristic plants and animals. Temperature and rainfall are the two main factors that determine which biome exists in a given place.\n\n' +
        'Think of biomes as nature\'s dress code. The climate sets the rules, and the plants and animals "dress" accordingly — thick fur in cold biomes, waxy leaves in dry ones, broad leaves in wet forests.\n\n' +
        '**The world\'s major terrestrial biomes:**\n\n' +
        '| Biome | Temperature | Rainfall | Signature plants | Signature animals |\n' +
        '|-------|------------|----------|-----------------|-------------------|\n' +
        '| Tropical rainforest | Hot (25–28°C year-round) | Very high (>2,000 mm) | Tall broadleaf trees, epiphytes | Primates, parrots, tree frogs |\n' +
        '| Tropical grassland/savanna | Hot (20–30°C) | Seasonal (500–1,500 mm) | Tall grasses, scattered trees | Rhinos, wild buffalo, deer |\n' +
        '| Temperate forest | Moderate (5–20°C) | Moderate (750–1,500 mm) | Oaks, maples, beeches | Deer, bears, woodpeckers |\n' +
        '| Boreal/coniferous forest | Cold (−10 to 15°C) | Low-moderate (300–900 mm) | Spruce, fir, pine | Wolves, moose, owls |\n' +
        '| Alpine meadow | Cold (−5 to 10°C) | Variable | Grasses, rhododendrons, mosses | Yaks, snow leopards, pikas |\n' +
        '| Desert | Hot or cold | Very low (<250 mm) | Cacti, succulents | Lizards, scorpions, camels |\n' +
        '| Wetland/marsh | Variable | Waterlogged | Reeds, water lilies, mangroves | Fish, wading birds, otters |\n\n' +
        '**Elevation as a biome shortcut:**\n\n' +
        'Climbing a mountain is like travelling from the equator to the poles. Every 1,000 m of elevation gain drops the temperature by about 6.5°C. In the Eastern Himalayas, you can walk through four or five biome types in a single day\'s trek:\n\n' +
        '| Elevation | Biome | What you see |\n' +
        '|-----------|-------|-------------|\n' +
        '| 0–500 m | Tropical grassland and floodplain | Elephant grass taller than a truck, ox-bow lakes, rhinos |\n' +
        '| 500–1,500 m | Subtropical broadleaf forest | Dense canopy of sal, teak, bamboo; hornbills, hoolock gibbons |\n' +
        '| 1,500–2,500 m | Temperate broadleaf forest | Oaks, maples, magnolias; red pandas, clouded leopards |\n' +
        '| 2,500–3,500 m | Coniferous forest | Spruce, fir, hemlock; musk deer, blood pheasant |\n' +
        '| 3,500–4,500 m | Alpine meadow | Rhododendrons (80+ species), primulas, blue poppies |\n' +
        '| >5,000 m | Permanent snow and glacier | Rock, ice, and the hardiest lichens |\n\n' +
        'This compression of biomes into a small geographic area is why the Eastern Himalayas are a global biodiversity hotspot — one of 36 on Earth.',
      intermediateContent:
        '**What determines biome boundaries?**\n\n' +
        'Two variables explain most terrestrial biome distribution:\n\n' +
        '| Variable | Effect on biome | Measurement |\n' +
        '|----------|----------------|-------------|\n' +
        '| Mean annual temperature | Sets the growing season length | °C |\n' +
        '| Mean annual precipitation | Determines water availability | mm/year |\n' +
        '| **Precipitation-to-Evaporation ratio (P/E)** | Combines both factors | Dimensionless |\n\n' +
        'The **Whittaker biome diagram** plots these two variables to predict biome type. Additional factors modify the picture:\n\n' +
        '| Factor | How it modifies the biome |\n' +
        '|--------|-------------------------|\n' +
        '| Soil type | Sandy soils drain fast → drier conditions even with decent rainfall |\n' +
        '| Fire regime | Regular fire maintains grasslands; prevents forest encroachment |\n' +
        '| Flooding | Annual floods reset succession, maintaining grassland over forest |\n' +
        '| Altitude | Temperature drops ~6.5°C per 1,000 m rise |\n' +
        '| Rain shadow | Mountains block moisture → arid on leeward side |\n\n' +
        '**Kaziranga\'s grasslands exist because of flooding, not just climate.** Without the annual Brahmaputra floods, the flat alluvial plains would naturally succeed into forest. The floods kill tree seedlings, deposit nutrient-rich silt, and reset the clock — keeping the ecosystem in a perpetual early-successional state. Managed burning in the park (February–March) removes old dead grass, stimulates fresh growth, and prevents woody plants from taking over. This grassland is not a "failed forest" — it is a dynamic, disturbance-maintained biome.\n\n' +
        '**Loktak Lake (Manipur)** — a unique freshwater ecosystem. Its floating mats of vegetation called *phumdis* create a biome-within-a-biome. The critically endangered Sangai (dancing deer) walks on these floating islands — found nowhere else on Earth.',
      advancedContent:
        '**Biome shifts under climate change:**\n\n' +
        'Climate models project that biome boundaries will shift significantly over the coming decades:\n\n' +
        '| Current biome | Projected shift (2050–2100) | Consequence |\n' +
        '|---------------|---------------------------|-------------|\n' +
        '| Alpine meadow | Treeline moves upward 200–500 m | Alpine species squeezed toward summits — nowhere left to go |\n' +
        '| Temperate forest | Shifts poleward ~500 km | Species that can\'t migrate fast enough face extinction |\n' +
        '| Tropical grassland | Changed fire and flood regimes | Woody encroachment or conversion to savanna |\n' +
        '| Wetlands | Altered hydrology | Phumdis on Loktak Lake threatened by dam-altered water levels |\n\n' +
        '**Species velocity vs climate velocity:**\n\n' +
        'Climate zones are moving poleward at ~4.2 km/year (global average). Species must migrate to keep up:\n\n' +
        '| Organism | Migration rate (km/decade) | Can it keep up? |\n' +
        '|----------|--------------------------|----------------|\n' +
        '| Trees (seed dispersal) | 1–10 | ❌ Too slow |\n' +
        '| Small mammals | 10–50 | ⚠️ Marginal |\n' +
        '| Birds | 50–200 | ✅ Usually |\n' +
        '| Climate zones | 42 | — (the benchmark) |\n\n' +
        'This mismatch means future biomes will not simply shift intact — they will **disassemble**. Species with different migration abilities will separate, creating novel ecosystems with no historical analogue. Conservation corridors — like the elephant corridors connecting Kaziranga to the Karbi Anglong hills — become critical infrastructure for climate adaptation, not just current-day connectivity.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each biome to its defining characteristic',
          pairs: [
            ['Tropical grassland', 'Maintained by seasonal flooding and fire — tall grasses dominate over trees'],
            ['Alpine meadow', 'Above the treeline — short growing season, rhododendrons, extreme UV'],
            ['Subtropical broadleaf forest', 'Dense canopy of sal, teak, bamboo — warm and wet year-round'],
            ['Wetland', 'Waterlogged soils create oxygen-poor conditions — reeds, floating vegetation, wading birds'],
          ],
        },
      },
    },

    // ── Section 6: Ecological Succession ───────────────────────
    {
      title: 'Ecological Succession',
      diagram: 'ForestSuccessionDiagram',
      beginnerContent:
        'If you abandoned a rice paddy today, would it look the same in 10 years? In 50? In 200? The answer is no — and the transformation follows a predictable pattern called **ecological succession**.\n\n' +
        'Think of succession as nature\'s construction crew rebuilding after a disturbance. The first workers (pioneer species) prepare the ground. Each crew changes the site in ways that make it better for the next crew — until the final "building" (the climax community) is complete.\n\n' +
        '**Primary succession** starts from bare rock or new land (no soil exists):\n\n' +
        '| Stage | Time | What arrives | What changes |\n' +
        '|-------|------|-------------|-------------|\n' +
        '| 1. Bare rock | Year 0 | Lichens, cyanobacteria | Acids from lichens begin weathering rock into mineral particles |\n' +
        '| 2. Thin soil | 10–50 years | Mosses, small ferns | Dead lichens add organic matter; thin soil forms |\n' +
        '| 3. Herbaceous | 50–100 years | Grasses, wildflowers | Roots break up more rock; soil deepens |\n' +
        '| 4. Shrubs | 100–200 years | Bushes, small woody plants | Shade increases; soil retains more moisture |\n' +
        '| 5. Young forest | 200–500 years | Fast-growing trees (pioneer trees like alder, birch) | Canopy closes; forest floor conditions develop |\n' +
        '| 6. Climax forest | 500+ years | Shade-tolerant hardwoods (oaks, sal) | Stable, self-replacing community |\n\n' +
        '**Secondary succession** starts from disturbed land where soil already exists (abandoned farmland, after fire, after logging). It\'s much faster:\n\n' +
        '| Stage | Time | What arrives |\n' +
        '|-------|------|-------------|\n' +
        '| 1. Bare soil | Year 0 | Weeds, annual grasses (arrive within weeks) |\n' +
        '| 2. Grassland | 1–5 years | Perennial grasses, wildflowers |\n' +
        '| 3. Shrubland | 5–20 years | Shrubs, bamboo, fast-growing trees |\n' +
        '| 4. Young forest | 20–80 years | Pioneer tree species shade out grasses |\n' +
        '| 5. Mature forest | 80–200 years | Climax species replace pioneers |\n\n' +
        '**A real example from the Karbi Anglong hills:** Abandoned *jhum* (shifting cultivation) plots go through exactly these stages. First come weedy annuals, then *Imperata* grass, then bamboo and *Macaranga* trees, and finally — if left undisturbed for 50+ years — a secondary forest with canopy trees, epiphytes, and a functioning understory.',
      intermediateContent:
        '**What drives succession? Facilitation, tolerance, and inhibition:**\n\n' +
        '| Model | Mechanism | Example |\n' +
        '|-------|-----------|--------|\n' +
        '| **Facilitation** | Early species modify the environment to benefit later species | Alder trees fix nitrogen, enriching soil for oaks that follow |\n' +
        '| **Tolerance** | Later species simply tolerate conditions better; they don\'t need early species | Shade-tolerant seedlings grow under pioneer canopy regardless |\n' +
        '| **Inhibition** | Early arrivals resist replacement until they die or are disturbed | Dense bamboo thickets prevent tree seedlings from establishing |\n\n' +
        'In reality, all three operate simultaneously in most successions.\n\n' +
        '**Shifting cultivation (*jhum*) and succession timing:**\n\n' +
        'Traditional *jhum* cycles depend on succession to restore soil fertility:\n\n' +
        '| Fallow period | What recovers | Soil fertility |\n' +
        '|---------------|--------------|----------------|\n' +
        '| 1–3 years | Annual weeds, grasses | 20–30% of original |\n' +
        '| 5–10 years | Shrubs, bamboo; leaf litter begins accumulating | 40–60% |\n' +
        '| 15–25 years | Young secondary forest; nitrogen-fixing trees established | 70–85% |\n' +
        '| 30+ years | Mature secondary forest; full nutrient cycling restored | 90–100% |\n\n' +
        'When population pressure shortens *jhum* cycles from 25–30 years to 3–5 years, the soil never recovers — leading to degraded grasslands and declining yields. This is a successional trap: the land is disturbed before it can reach the stage that restores its fertility.',
      advancedContent:
        '**Quantifying succession — species diversity over time:**\n\n' +
        'The **Shannon diversity index** (H\' = −Σ pᵢ ln pᵢ) tracks how diversity changes during succession:\n\n' +
        '| Successional stage | Species richness (S) | Evenness (J) | H\' |\n' +
        '|-------------------|---------------------|-------------|-----|\n' +
        '| Pioneer (weeds) | Low (5–15) | Low (few dominants) | 0.5–1.2 |\n' +
        '| Mid-succession (shrubs) | Rising (30–60) | Moderate | 2.0–2.8 |\n' +
        '| Late succession (forest) | High (80–150) | High | 3.0–4.0 |\n' +
        '| Old-growth (climax) | Highest (150–300+) | Very high | 3.5–4.5 |\n\n' +
        '**Chronosequence studies** — comparing sites of different ages that started succession at known times — are the primary method for reconstructing successional trajectories. In the Naga Hills, researchers have used dated *jhum* plots (abandoned 2, 5, 10, 25, and 50 years ago) as a natural chronosequence to measure biomass recovery, soil carbon accumulation, and species turnover rates.\n\n' +
        '**Alternative stable states theory** challenges the linear view of succession. Some ecosystems can exist in two or more stable states (e.g., grassland vs forest) under the same climate. A sufficiently large disturbance (fire, overgrazing) can flip the system from one state to another, and it may not return without active intervention. Kaziranga\'s grasslands and the adjacent forests may represent such alternative stable states — maintained in grassland by flooding and fire, but capable of transitioning to forest if disturbance ceases.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'Primary succession on bare rock can take over 1,000 years to reach a climax forest — but secondary succession on abandoned farmland can form a young forest in just 20–30 years because soil already exists.',
            'The island of Surtsey (born from a volcanic eruption off Iceland in 1963) has been a living laboratory for primary succession — scientists have tracked every new species arrival for over 60 years.',
            'Bamboo can colonise a disturbed site so aggressively that it prevents tree seedlings from establishing for decades — a textbook case of the inhibition model of succession.',
            'Some fire-adapted ecosystems (like Kaziranga\'s grasslands) never reach "climax forest" because regular disturbance resets the successional clock — these are called disclimax or disturbance-maintained communities.',
          ],
        },
      },
    },

    // ── Section 7: Soil — The Living Foundation ────────────────
    {
      title: 'Soil: The Living Foundation',
      diagram: 'ForestSoilLayersDiagram',
      beginnerContent:
        'Soil is not dirt. It is one of the most complex ecosystems on Earth — a living, breathing layer where geology meets biology. A single teaspoon of healthy soil contains more microorganisms than there are people on the planet.\n\n' +
        'Think of soil as a layered cake, built over centuries:\n\n' +
        '**Soil horizons (layers):**\n\n' +
        '| Horizon | Name | What it is | Thickness |\n' +
        '|---------|------|-----------|----------|\n' +
        '| **O** | Organic | Dead leaves, twigs, decomposing matter | 1–10 cm |\n' +
        '| **A** | Topsoil | Dark, nutrient-rich mix of minerals and humus | 10–30 cm |\n' +
        '| **B** | Subsoil | Accumulated minerals leached down from above | 30–60 cm |\n' +
        '| **C** | Parent material | Weathered rock fragments | Variable |\n' +
        '| **R** | Bedrock | Solid, unweathered rock | — |\n\n' +
        '**Soil is built from two directions simultaneously:**\n' +
        '- **From below:** Physical and chemical weathering breaks bedrock into smaller and smaller particles\n' +
        '- **From above:** Dead plants and animals decompose, adding organic matter (humus)\n\n' +
        'These two processes meet in the topsoil (A horizon), creating the fertile layer where most roots grow and most soil life thrives.\n\n' +
        '**Soil texture — the mineral fraction:**\n\n' +
        '| Particle | Size | Properties |\n' +
        '|----------|------|------------|\n' +
        '| **Sand** | 0.05–2 mm | Large gaps → drains fast, holds few nutrients |\n' +
        '| **Silt** | 0.002–0.05 mm | Medium → holds moderate water and nutrients |\n' +
        '| **Clay** | < 0.002 mm | Tiny → holds lots of water and nutrients (but can waterlog) |\n' +
        '| **Loam** | Balanced mix | Ideal for most plants — drains well AND holds nutrients |\n\n' +
        'The alluvial soils of the Brahmaputra floodplain are a gift of the river. Each monsoon flood deposits a thin layer of fine silt — rich in minerals washed down from the Himalayas. This annual replenishment is why the floodplain is one of the most fertile regions on Earth, supporting dense populations and intensive rice cultivation without heavy fertiliser use.',
      intermediateContent:
        '**The soil food web — a hidden ecosystem:**\n\n' +
        'Below your feet, a complex food web operates in darkness:\n\n' +
        '| Organism | Population per m² | Role |\n' +
        '|----------|-------------------|------|\n' +
        '| Bacteria | 10⁸–10¹⁰ | Decompose organic matter, fix nitrogen |\n' +
        '| Fungi | Kilometres of hyphae | Decompose lignin, form mycorrhizal networks |\n' +
        '| Protozoa | 10⁴–10⁶ | Eat bacteria, release nutrients |\n' +
        '| Nematodes | 10²–10⁴ | Graze on bacteria, fungi, and roots |\n' +
        '| Earthworms | 50–500 | Mix soil layers, create channels for air and water |\n' +
        '| Arthropods (mites, springtails) | 10³–10⁵ | Shred organic matter, prey on smaller organisms |\n\n' +
        '**Mycorrhizal networks** — sometimes called the "wood-wide web" — are fungal filaments that connect tree roots underground. Through these networks, trees can:\n' +
        '- Share sugars with shaded seedlings\n' +
        '- Transfer phosphorus and nitrogen between species\n' +
        '- Send chemical warning signals when attacked by pests\n\n' +
        'In a single hectare of forest, mycorrhizal networks can extend for **hundreds of kilometres** of fungal threads, connecting every tree in the stand.\n\n' +
        '**Worked example — soil carbon loss after deforestation:**\n\n' +
        '| Year after clearing | Soil organic carbon (% of original) | What happened |\n' +
        '|--------------------|------------------------------------|---------------|\n' +
        '| 0 (forest intact) | 100% | Full litter input, slow decomposition |\n' +
        '| 1 | 90% | Litter input stops; decomposition continues |\n' +
        '| 5 | 70% | Soil exposed to sun → warmer → faster decomposition |\n' +
        '| 10 | 55% | Erosion removes topsoil; remaining carbon depleted |\n' +
        '| 20 | 40–50% | New equilibrium under agriculture (if not eroded away) |',
      advancedContent:
        '**Soil classification and the pedogenic processes:**\n\n' +
        'The formation of soil (pedogenesis) involves five factors, articulated by Hans Jenny (1941):\n\n' +
        '`S = f(cl, o, r, p, t)`\n\n' +
        'where cl = climate, o = organisms, r = relief/topography, p = parent material, t = time.\n\n' +
        '| Process | What happens | Resulting soil feature |\n' +
        '|---------|-------------|----------------------|\n' +
        '| **Eluviation** | Water leaches minerals downward from A horizon | Pale, depleted E horizon |\n' +
        '| **Illuviation** | Leached minerals accumulate in B horizon | Clay-enriched, often reddish B horizon |\n' +
        '| **Laterisation** | Intense tropical weathering leaches silica, concentrates iron/aluminium oxides | Laterite soils (red, hard, nutrient-poor) |\n' +
        '| **Gleying** | Waterlogged conditions → iron reduced (Fe²⁺) | Blue-grey, anaerobic soil |\n' +
        '| **Podzolisation** | Acidic organic matter leaches iron and aluminium | White E horizon, dark B horizon |\n\n' +
        'The laterite soils common in the Meghalaya plateau are products of intense tropical weathering over millions of years. Despite the lush forest above, these soils are actually nutrient-poor — the forest survives by recycling nutrients rapidly through decomposition, not by drawing on soil reserves. Remove the forest, and the laterite soils are nearly useless for agriculture — a lesson learned painfully in many tropical deforestation projects.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each soil component to its role in the ecosystem',
          pairs: [
            ['Earthworms', 'Mix soil layers, create channels for air and water, speed decomposition'],
            ['Mycorrhizal fungi', 'Connect tree roots underground, share nutrients and chemical signals'],
            ['Clay particles', 'Hold water and nutrients tightly — essential for fertility but prone to waterlogging'],
            ['Humus (decomposed organic matter)', 'Dark, spongy material that improves water retention, nutrient holding, and soil structure'],
          ],
        },
      },
    },

    // ── Section 8: Fire Ecology ────────────────────────────────
    {
      title: 'Fire Ecology',
      diagram: 'GrassFireCycleDiagram',
      beginnerContent:
        'Fire seems destructive, but many ecosystems don\'t just survive fire — they **need** it. Without periodic burning, these ecosystems would transform into something entirely different.\n\n' +
        'Think of fire as a reset button. It clears out old, dead material, returns nutrients to the soil, and opens up space for new growth. Some plants have evolved to depend on fire the way animals depend on water.\n\n' +
        '**Why some ecosystems need fire:**\n\n' +
        '| Without fire | With periodic fire |\n' +
        '|-------------|--------------------|\n' +
        '| Dead grass accumulates in thick layers | Dead grass removed; nutrients returned to soil as ash |\n' +
        '| Woody shrubs and trees invade grassland | Tree seedlings killed; grassland maintained |\n' +
        '| Old growth blocks sunlight from reaching ground | Fresh, nutrient-rich shoots sprout within days |\n' +
        '| Species diversity declines | Diverse mix of fire-adapted species thrives |\n\n' +
        '**Fire-adapted traits:**\n\n' +
        '| Adaptation | How it works | Example |\n' +
        '|-----------|-------------|--------|\n' +
        '| **Thick bark** | Insulates the living tissue inside the trunk | Sal trees survive ground fires |\n' +
        '| **Underground storage organs** | Roots, rhizomes, and bulbs survive below the heat | Elephant grass regrows from rhizomes within weeks |\n' +
        '| **Serotinous cones** | Cones sealed with resin open only in fire\'s heat | Some pine species in the Himalayan foothills |\n' +
        '| **Fire-stimulated germination** | Seeds require smoke or heat chemicals to sprout | Many grassland wildflowers |\n' +
        '| **Resprouting** | Epicormic buds under bark activate after fire | Eucalyptus (introduced), many native hardwoods |\n\n' +
        'In Kaziranga National Park, forest managers conduct **controlled burns** every February–March. The timing is critical: late dry season ensures the old grass burns completely, but the approaching monsoon will soon bring moisture for regrowth. Without these burns, the tall elephant grass would be smothered by its own dead thatch, and invasive woody plants would creep in — eventually converting the grassland to scrubland. The rhinos, wild buffalo, and swamp deer that depend on open grassland would lose their habitat.\n\n' +
        '**Quick check:** A grassland hasn\'t burned for 15 years. What would you expect to see?\n\n' +
        '*Thick dead-grass thatch on the ground, shrubs and tree saplings growing taller, reduced grass diversity, and fewer grazing animals — the grassland is slowly converting to scrubland or forest.*',
      intermediateContent:
        '**Fire regimes — frequency, intensity, and type matter:**\n\n' +
        '| Fire characteristic | Low | Moderate | High |\n' +
        '|--------------------|-----|----------|------|\n' +
        '| **Frequency** (years between fires) | 1–3 | 5–15 | 25–100+ |\n' +
        '| **Intensity** (energy released, kW/m) | < 350 | 350–3,000 | > 3,000 |\n' +
        '| **Type** | Ground fire (burns leaf litter) | Surface fire (burns grass/shrubs) | Crown fire (burns treetops) |\n\n' +
        '| Fire regime | Ecosystem maintained | Example |\n' +
        '|------------|--------------------|---------|\n' +
        '| Frequent, low intensity | Open grassland and savanna | Kaziranga managed burns |\n' +
        '| Moderate frequency, moderate intensity | Open woodland with grassy understory | Sal forests with ground fires |\n' +
        '| Infrequent, high intensity | Dense forest with periodic catastrophic reset | Boreal forests after lightning strikes |\n\n' +
        '**Worked example — nutrient pulse from a controlled burn:**\n\n' +
        '| Nutrient | In dead grass before burn (kg/ha) | In ash after burn (kg/ha) | Available for regrowth |\n' +
        '|---------|----------------------------------|--------------------------|----------------------|\n' +
        '| Nitrogen | 80 | 5 (most volatilised as N₂) | Low — N is lost to atmosphere |\n' +
        '| Phosphorus | 12 | 11 (remains in ash) | High — P recycled immediately |\n' +
        '| Potassium | 45 | 40 (remains in ash) | High — K recycled |\n' +
        '| Calcium | 30 | 28 | High |\n\n' +
        'Fire is an excellent recycler of phosphorus, potassium, and calcium, but it **loses nitrogen** to the atmosphere. This is why fire-maintained grasslands often have nitrogen-fixing plants (legumes) as a key component — they replenish what fire removes.',
      advancedContent:
        '**Fire-vegetation feedback loops and alternative stable states:**\n\n' +
        'In tropical regions, fire creates a positive feedback that maintains grassland:\n\n' +
        '`Grass grows → accumulates dry fuel → fire burns → kills tree seedlings → grass regrows`\n\n' +
        'Meanwhile, forest creates a negative feedback that suppresses fire:\n\n' +
        '`Trees grow → canopy shades out grass → less fuel → fire can\'t carry → more trees grow`\n\n' +
        'This creates two **alternative stable states** under the same climate:\n\n' +
        '| State | Maintains itself via | Tipping point |\n' +
        '|-------|---------------------|---------------|\n' +
        '| Grassland/savanna | Fire feedback (grass → fuel → fire → kills trees) | If fire excluded long enough, trees establish and shade out grass |\n' +
        '| Closed forest | Shade feedback (canopy → no fuel → no fire → more canopy) | If canopy is broken (logging, cyclone), grass invades and fire starts |\n\n' +
        'Satellite analysis of tropical regions shows a **bimodal distribution** of tree cover — landscapes tend to be either <20% tree cover (grass-dominated) or >60% (forest-dominated), with few in between. This is the signature of alternative stable states: the intermediate condition is unstable.\n\n' +
        'Understanding these dynamics is critical for conservation. Fire suppression in grassland ecosystems (often well-intentioned) can trigger an irreversible transition to forest, destroying habitat for grassland specialists like the Bengal florican, Indian rhinoceros, and pygmy hog. Conversely, logging that opens forest canopy can trigger a transition to fire-maintained grassland that is extremely difficult to reverse.',
    },

    // ── Section 9: Habitat & Wildlife Corridors ────────────────
    {
      title: 'Habitat & Wildlife Corridors',
      diagram: 'GrassRhinoHabitatDiagram',
      beginnerContent:
        'An animal doesn\'t just need food — it needs a **habitat**: a place with the right food, water, shelter, mates, and space. And many animals need more than one habitat — they need to **move** between them.\n\n' +
        'Think of habitats as rooms in a house. A bedroom alone isn\'t enough — you also need a kitchen, a bathroom, and doors connecting them. For wildlife, corridors are those doors.\n\n' +
        '**What makes a habitat:**\n\n' +
        '| Component | What it provides | Example |\n' +
        '|-----------|-----------------|--------|\n' +
        '| **Food** | Energy and nutrients | Grassland for grazers, forest for frugivores |\n' +
        '| **Water** | Hydration, breeding sites | Rivers, wetlands, seasonal pools |\n' +
        '| **Shelter** | Protection from weather and predators | Dense vegetation, burrows, tree cavities |\n' +
        '| **Space** | Territory for feeding and breeding | Tigers need 20–100 km² per individual |\n' +
        '| **Connectivity** | Access to mates and genetic diversity | Corridors between habitat patches |\n\n' +
        '**Why corridors matter — the fragmentation problem:**\n\n' +
        'When a continuous habitat is broken into isolated patches by roads, farms, or settlements, three damaging things happen:\n\n' +
        '| Problem | Consequence |\n' +
        '|---------|------------|\n' +
        '| **Isolation** | Animals can\'t reach mates → inbreeding → genetic weakness |\n' +
        '| **Edge effects** | Patch borders are hotter, drier, and more exposed than interiors |\n' +
        '| **Area reduction** | Smaller patches support fewer species (species-area relationship) |\n\n' +
        '**Worked example — the elephant corridors:**\n\n' +
        'Asian elephants in Assam need to move between Kaziranga (floodplain grassland — wet season habitat) and the Karbi Anglong hills (high ground during floods). Historically, broad corridors of forest connected the two. Today, tea plantations and settlements have narrowed some corridors to just 100 metres wide.\n\n' +
        '| Corridor condition | Elephant behavior | Human impact |\n' +
        '|-------------------|-------------------|-------------|\n' +
        '| Wide (>500 m), forested | Elephants pass quietly at night | Minimal conflict |\n' +
        '| Narrow (100–500 m), degraded | Elephants squeeze through, sometimes damaging crops | Moderate conflict |\n' +
        '| Blocked | Elephants forced through villages | Severe conflict — crop damage, injuries, deaths |\n\n' +
        'Protecting and restoring these corridors is not just about elephants — every species that moves between lowland and highland habitats benefits, from leopards to hornbills to insects.',
      intermediateContent:
        '**The species-area relationship:**\n\n' +
        'In 1967, MacArthur and Wilson proposed that the number of species on an island (or habitat patch) depends on its area:\n\n' +
        '`S = cA^z`\n\n' +
        'where S = species count, A = area, c = constant (varies by taxon), z = slope (typically 0.15–0.35).\n\n' +
        '| Area (km²) | Predicted bird species (z = 0.25) | % of mainland species |\n' +
        '|-----------|----------------------------------|----------------------|\n' +
        '| 1 | 15 | 10% |\n' +
        '| 10 | 27 | 18% |\n' +
        '| 100 | 48 | 32% |\n' +
        '| 1,000 | 85 | 57% |\n' +
        '| 10,000 | 150 | 100% (mainland) |\n\n' +
        '**Implications for conservation:**\n\n' +
        '| Design principle | Reasoning |\n' +
        '|-----------------|----------|\n' +
        '| One large reserve > several small ones (SLOSS debate) | Large reserves have more interior habitat, less edge |\n' +
        '| Connected reserves > isolated reserves | Corridors allow migration and gene flow |\n' +
        '| Circular reserves > elongated ones | Circle has minimum edge-to-area ratio |\n' +
        '| Buffer zones around reserves | Gradual transition reduces edge effects |\n\n' +
        '**Minimum viable population (MVP):**\n\n' +
        'A population needs enough individuals to avoid inbreeding and random extinction:\n\n' +
        '| Species | Estimated MVP | Current population | Status |\n' +
        '|---------|--------------|-------------------|--------|\n' +
        '| Indian rhinoceros | ~500 | ~2,600 (Kaziranga: ~2,400) | Recovering |\n' +
        '| Bengal tiger | ~250 | ~3,000 (India-wide) | Vulnerable |\n' +
        '| Sangai deer | ~50 | ~260 (only in Loktak) | Critically endangered |\n' +
        '| Pygmy hog | ~50 | ~250 (wild, Assam grasslands) | Endangered |',
      advancedContent:
        '**Landscape genetics — using DNA to map connectivity:**\n\n' +
        'Modern conservation uses genetic data to measure whether corridors actually work:\n\n' +
        '| Genetic metric | What it reveals | How it\'s measured |\n' +
        '|---------------|----------------|-------------------|\n' +
        '| **F_ST** (fixation index) | Genetic differentiation between populations | 0 = identical, 1 = completely different |\n' +
        '| **Effective population size (N_e)** | Breeding population (usually 10–30% of census size) | Heterozygosity and allele frequency analysis |\n' +
        '| **Gene flow (Nm)** | Number of migrants exchanged per generation | Estimated from F_ST: Nm ≈ (1 − F_ST) / 4F_ST |\n' +
        '| **Isolation by distance (IBD)** | Does genetic distance increase with geographic distance? | Mantel test: correlation of genetic vs geographic distance matrices |\n\n' +
        'Studies on Asian elephants in Assam show that populations connected by intact corridors have low F_ST (high gene flow), while populations separated by broken corridors are diverging genetically — a warning sign for long-term viability.\n\n' +
        '**Circuit theory** models landscapes as electrical circuits, where habitat patches are nodes, corridors are resistors, and current flow represents animal movement probability. High-current paths identify the most critical corridors for conservation investment. This approach identified previously unknown movement routes for tigers between Kaziranga and Orang National Park that now receive targeted protection.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A single large nature reserve protects more species than several small reserves of equal total area.', answer: true, explanation: 'A single large reserve has more interior habitat (away from edges), supports species with large territories, and maintains larger populations less prone to extinction. This is the "SLOSS" principle in conservation biology.' },
            { text: 'Elephants in Assam move between lowland and highland areas because they are migrating to warmer climates.', answer: false, explanation: 'Elephants move to the Karbi Anglong hills during monsoon to escape flooding in the Brahmaputra floodplain, not for temperature. When floods recede, they return to the nutrient-rich lowland grasslands.' },
            { text: 'Edge effects make the borders of habitat patches drier and warmer than the interior.', answer: true, explanation: 'Forest edges are exposed to wind and direct sunlight, making them hotter and drier. This changes which species can survive there — many deep-forest specialists avoid edges entirely.' },
            { text: 'If a corridor between two reserves is blocked, the genetic diversity of isolated populations increases.', answer: false, explanation: 'Isolation reduces genetic diversity through inbreeding and genetic drift. Without gene flow from other populations, rare alleles are lost and deleterious mutations accumulate.' },
          ],
        },
      },
    },

    // ── Section 10: Human Impact & Conservation ────────────────
    {
      title: 'Human Impact & Conservation',
      diagram: 'ForestCarbonCycleDiagram',
      beginnerContent:
        'Humans are now the single most powerful force reshaping ecosystems on Earth. We clear forests, dam rivers, drain wetlands, introduce invasive species, and change the climate. But we also protect, restore, and sometimes bring species back from the brink.\n\n' +
        '**The scale of human impact:**\n\n' +
        '| Impact | Global scale | Regional example |\n' +
        '|--------|-------------|------------------|\n' +
        '| Deforestation | 10 million hectares/year | >10,000 km² of tree cover lost in NE India (2001–2020) |\n' +
        '| Species extinction | 100–1,000× natural rate | Pygmy hog and Sangai deer critically endangered |\n' +
        '| Climate change | +1.2°C since 1850 | Shifting monsoons, more intense Brahmaputra floods |\n' +
        '| Habitat fragmentation | 70% of forest within 1 km of an edge | Elephant corridors narrowed to <100 m in places |\n' +
        '| Plastic pollution | 8 million tonnes enter oceans/year | Microplastics found in Brahmaputra river sediments |\n\n' +
        '**But conservation works.** When communities, governments, and scientists work together, ecosystems recover:\n\n' +
        '| Success story | What happened | Result |\n' +
        '|--------------|--------------|--------|\n' +
        '| Indian rhinoceros | Strict protection in Kaziranga since 1905 | Population: ~200 → ~2,600 |\n' +
        '| Amur falcon protection | Nagaland villagers stopped hunting, started protecting | Millions of falcons now roost safely during migration |\n' +
        '| Manas tiger recovery | Community-based patrols after political stability returned | Tiger numbers rebounding |\n' +
        '| Community forests | Villages manage and protect local forests | Deforestation halted in participating areas |\n\n' +
        '**Ecosystem services — why conservation is also economics:**\n\n' +
        'Healthy ecosystems provide free services worth trillions of dollars annually:\n\n' +
        '| Service | What the ecosystem provides | What happens if lost |\n' +
        '|---------|---------------------------|--------------------|\n' +
        '| **Water purification** | Wetlands filter pollutants | Must build expensive treatment plants |\n' +
        '| **Flood control** | Floodplain forests absorb monsoon surges | Severe flooding, property damage |\n' +
        '| **Carbon sequestration** | Forests absorb CO₂ | Accelerated climate change |\n' +
        '| **Pollination** | Insects and birds pollinate crops | Must hand-pollinate (costs $200+ billion/year) |\n' +
        '| **Soil fertility** | Decomposers recycle nutrients | Must add synthetic fertiliser |\n\n' +
        'Protecting a forest isn\'t a luxury — it\'s infrastructure. The forests of the Eastern Himalayas regulate the water supply for hundreds of millions of people downstream in the Brahmaputra and Ganges basins.',
      intermediateContent:
        '**Quantifying biodiversity loss — the IUCN Red List categories:**\n\n' +
        '| Category | Abbreviation | Criteria (simplified) |\n' +
        '|---------|-------------|----------------------|\n' +
        '| Least Concern | LC | Population stable, widespread |\n' +
        '| Near Threatened | NT | Close to qualifying as threatened |\n' +
        '| Vulnerable | VU | >30% population decline in 10 years/3 generations |\n' +
        '| Endangered | EN | >50% decline, or <5,000 mature individuals |\n' +
        '| Critically Endangered | CR | >80% decline, or <250 mature individuals |\n' +
        '| Extinct in the Wild | EW | Only in captivity |\n' +
        '| Extinct | EX | No individuals remain |\n\n' +
        '**Species from the region across Red List categories:**\n\n' +
        '| Species | IUCN Status | Primary threat |\n' +
        '|---------|------------|----------------|\n' +
        '| Indian rhinoceros | VU | Poaching, habitat loss |\n' +
        '| Bengal tiger | EN | Habitat fragmentation, poaching |\n' +
        '| Sangai deer | EN | Habitat degradation (Loktak Lake) |\n' +
        '| Pygmy hog | EN | Grassland loss, inappropriate burning |\n' +
        '| Hoolock gibbon | EN | Deforestation, fragmentation |\n' +
        '| Bengal florican | CR | Grassland conversion to agriculture |\n' +
        '| White-bellied heron | CR | Habitat disturbance along rivers |\n\n' +
        '**Payment for Ecosystem Services (PES)** — a growing conservation tool:\n\n' +
        'Downstream beneficiaries (cities, hydropower companies) pay upstream communities to maintain forests that provide clean water and flood control. This creates a direct economic incentive for conservation, turning forests from "obstacles to development" into income-generating assets.',
      advancedContent:
        '**Conservation prioritisation frameworks:**\n\n' +
        'With limited resources, where should conservation investment go? Several frameworks exist:\n\n' +
        '| Framework | Criterion | Strength | Weakness |\n' +
        '|-----------|----------|----------|----------|\n' +
        '| **Biodiversity hotspots** (Myers) | High endemism + high threat | Focuses on irreplaceable species | Ignores large wilderness areas |\n' +
        '| **Key Biodiversity Areas (KBAs)** | Sites with globally significant populations | Site-specific and actionable | Expensive to survey |\n' +
        '| **Systematic conservation planning** (Margules & Pressey) | Mathematical optimisation of reserve networks | Maximises representation per dollar | Requires extensive species data |\n' +
        '| **EDGE species** | Evolutionarily Distinct and Globally Endangered | Preserves evolutionary history | May miss ecologically important species |\n\n' +
        '**The extinction debt:**\n\n' +
        'When habitat is fragmented, species don\'t disappear immediately. Small populations persist for years or decades before dwindling to zero. This means that today\'s landscape "owes" future extinctions from past habitat loss — the extinction debt. Studies in tropical forests estimate that 20–50% of current species in fragmented patches are "living dead" — doomed to extinction without corridor restoration or habitat expansion.\n\n' +
        '**Half-Earth hypothesis** (E.O. Wilson, 2016): Protecting 50% of Earth\'s land and sea surface — strategically chosen — could safeguard ~85% of species. Currently, ~17% of land and ~8% of ocean is protected. The gap between current protection and the Half-Earth target represents the scale of conservation ambition needed.\n\n' +
        'In the Eastern Himalayas biodiversity hotspot, the priority is clear: protect existing primary forest, restore corridors between fragments, and work with communities who live in and depend on these ecosystems. Top-down conservation without local partnership has repeatedly failed; the Nagaland Amur falcon story proves that community-led conservation can succeed spectacularly.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'The Indian rhinoceros was down to fewer than 200 individuals in the early 1900s. Thanks to strict protection in Kaziranga and other reserves, there are now over 2,600 — one of Asia\'s greatest conservation successes.',
            'A single hectare of tropical forest can sequester 5–10 tonnes of CO₂ per year — making forest protection one of the most cost-effective climate change solutions available.',
            'The Nagaland Amur falcon story: villagers who once netted 120,000+ falcons per season for food now protect the birds and earn tourism income instead — a complete reversal driven by community pride, not punishment.',
            'The "extinction debt" means that species losses from deforestation that happened decades ago are still playing out today — isolated populations slowly declining toward zero without intervention.',
          ],
        },
      },
    },
  ],
};
