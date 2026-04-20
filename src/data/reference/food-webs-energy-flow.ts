import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'food-webs-energy-flow',
  title: 'Food Webs & Energy Flow',
  category: 'ecology',
  icon: '🌿',
  tagline: 'Who eats whom — how energy flows from sunlight through every living thing.',
  relatedStories: ['kaziranga-grass', 'elephant-corridor', 'golden-hilsa'],
  understand: [
    // ── Section 1: Producers, Consumers, and Decomposers ──────────
    {
      title: 'Producers, Consumers, and Decomposers',
      diagram: 'GrassRhinoHabitatDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each role to its definition',
          pairs: [
            ['Producers (autotrophs)', 'Capture solar energy through photosynthesis — grasses, algae, phytoplankton'],
            ['Primary consumers (herbivores)', 'Eat producers directly — rhinos, deer, buffalo'],
            ['Secondary consumers (carnivores)', 'Eat herbivores — tigers, leopards, fishing cats'],
            ['Tertiary consumers (apex predators)', 'Top of the chain — feed on other carnivores'],
            ['Decomposers', 'Break down dead matter, recycling nutrients — fungi, bacteria, earthworms'],
          ],
        },
      },
      beginnerContent:
        'Every ecosystem runs on a single energy source: **sunlight**. Think of an ecosystem like a factory. The factory needs raw materials (sunlight, water, CO2), workers at different levels, and a cleanup crew. Without any one group, the whole operation shuts down.\n\n' +
        '**Producers** are the factory\'s first shift. Green plants, algae, and cyanobacteria capture sunlight through photosynthesis and convert it into glucose — chemical energy that every other organism depends on. In a floodplain grassland, towering elephant grass (*Saccharum ravennae*) converts monsoon sunlight and nutrient-rich river silt into biomass. Aquatic algae and phytoplankton in wetlands form a parallel base of production underwater.\n\n' +
        '| Role | Examples | Energy source | Trophic level |\n' +
        '|------|----------|---------------|---------------|\n' +
        '| Producer (autotroph) | Elephant grass, rice paddy, river algae | Sunlight via photosynthesis | 1 |\n' +
        '| Primary consumer (herbivore) | One-horned rhino, swamp deer, hog deer | Eating producers | 2 |\n' +
        '| Secondary consumer (carnivore) | Bengal tiger, leopard, fishing cat | Eating herbivores | 3 |\n' +
        '| Tertiary consumer (apex) | Pallas\'s fish eagle, large crocodile | Eating other carnivores | 4 |\n' +
        '| Decomposer | Fungi, bacteria, dung beetles | Dead organic matter | All levels |\n\n' +
        '**Analogy:** Imagine a relay race. Producers are the first runners — they receive the baton (energy) from the sun. They pass it to herbivores, who pass it to carnivores. Decomposers are the cleanup crew that picks up dropped batons and returns them to the starting line (soil), so the next race (growing season) can begin.\n\n' +
        '**Primary consumers** eat producers directly. The Indian one-horned rhinoceros can eat over 50 kg of grass per day. Wild water buffalo, swamp deer, and hog deer graze the same grasslands. Each species eats slightly different plants or plant parts, reducing direct competition — a pattern called **resource partitioning**.\n\n' +
        '**Secondary consumers** eat herbivores. Bengal tigers prey on deer and young buffalo. Fishing cats at Deepor Beel hunt fish and frogs. **Tertiary consumers** sit at the top — large raptors that eat fish that ate insects that ate algae.\n\n' +
        '| Decomposer type | What it breaks down | How fast? | Nutrients released |\n' +
        '|-----------------|--------------------|-----------|-----------------|\n' +
        '| Bacteria | Soft tissues, sugars, proteins | Hours to days | Nitrogen, phosphorus |\n' +
        '| Fungi | Tough cellulose, lignin in wood | Weeks to months | Carbon, phosphorus |\n' +
        '| Earthworms | Leaf litter, soil organic matter | Days to weeks | Nitrogen, calcium |\n' +
        '| Dung beetles | Animal waste | Hours to days | Nitrogen, phosphorus |\n' +
        '| Termites | Dead wood, fallen trees | Months to years | Carbon, nitrogen |\n\n' +
        '**Decomposers** are the unsung heroes. Without fungi, bacteria, earthworms, and dung beetles, dead matter would pile up and nutrients would stay locked in corpses forever. In warm, humid floodplain environments, decomposition is fast: a fallen tree can become soil in just a few years, recycling carbon, nitrogen, and phosphorus back into the ecosystem.\n\n' +
        '**Check yourself:** A patch of grassland produces 10,000 kg of plant biomass per year. If herbivores convert 10% to animal biomass, and carnivores convert 10% of that, how many kg of carnivore biomass can the patch support? (Answer: 100 kg.)',
      intermediateContent:
        'Ecologists quantify food-web structure with precise metrics. These numbers tell you how complex and stable a web is.\n\n' +
        '| Metric | Formula | What it measures | Typical range |\n' +
        '|--------|---------|------------------|---------------|\n' +
        '| Connectance (C) | C = L / S^2 | Fraction of possible links that exist | 0.03 – 0.30 |\n' +
        '| Link density (LD) | LD = L / S | Average links per species | 1.5 – 5.0 |\n' +
        '| Trophic level (TL) | TL = 1 + mean TL of prey | Position in the web | 1.0 – 5.0 |\n' +
        '| Omnivory index | Variance of prey TLs | How broadly a species feeds | 0 – 2.0 |\n\n' +
        'where L = number of feeding links, S = number of species.\n\n' +
        '**Worked example — Bengal tiger trophic level:**\n\n' +
        'A tiger eats swamp deer (TL 2.0), wild boar (TL 2.3, partly omnivorous), and hog deer (TL 2.0).\n\n' +
        '`Tiger TL = 1 + mean(2.0, 2.3, 2.0) = 1 + 2.1 = 3.1`\n\n' +
        'If the tiger also occasionally eats a fishing cat (TL 3.0):\n\n' +
        '`Tiger TL = 1 + mean(2.0, 2.3, 2.0, 3.0) = 1 + 2.325 = 3.325`\n\n' +
        'This confirms tigers sit at roughly TL 3.1–3.5 depending on diet composition.\n\n' +
        '**Assimilation and production efficiencies** differ dramatically by diet:\n\n' +
        '| Consumer type | Assimilation efficiency | Production efficiency | Combined (ecological) |\n' +
        '|---------------|----------------------|---------------------|-----------------------|\n' +
        '| Herbivore (endotherm) | 20–50% | 1–3% | 0.2–1.5% |\n' +
        '| Carnivore (endotherm) | 80% | 1–3% | 0.8–2.4% |\n' +
        '| Herbivore (ectotherm) | 20–50% | 10–25% | 2–12.5% |\n' +
        '| Carnivore (ectotherm) | 80% | 10–25% | 8–20% |\n\n' +
        'Herbivores have low assimilation because cellulose is tough to digest — a rhino passes much of what it eats as dung. Carnivores assimilate ~80% of animal tissue but still waste most of it on metabolism. Ectotherms (cold-blooded animals) are far more efficient because they don\'t burn energy to maintain body temperature.\n\n' +
        '**The Elton pyramid** predicts that body size generally increases and abundance decreases going up trophic levels. A grassland may have 10 billion blades of grass, 100,000 insects, 1,000 deer, and 10 tigers.',
      advancedContent:
        'Modern food-web ecology uses **network theory** to analyse stability and predict collapse.\n\n' +
        '**May\'s stability paradox (1972):** Robert May showed mathematically that randomly assembled communities with higher species richness (S) and connectance (C) are *less* stable — they destabilise when `sqrt(SC) > 1`. This contradicted the intuition that biodiversity = stability.\n\n' +
        '| Parameter | May\'s threshold | Real grassland web | Implication |\n' +
        '|-----------|----------------|-------------------|-------------|\n' +
        '| Species (S) | — | ~200 | — |\n' +
        '| Connectance (C) | — | ~0.05 | — |\n' +
        '| sqrt(SC) | Must be < 1 | sqrt(200 x 0.05) = 3.16 | Should be unstable! |\n\n' +
        'The paradox was resolved by recognising that real webs are **non-random**. Key stabilising structures include:\n\n' +
        '1. **Weak interactions** — most links have low interaction strength, dampening oscillations (McCann et al., 1998)\n' +
        '2. **Compartmentalisation** — species form semi-independent modules (aquatic vs. terrestrial sub-webs)\n' +
        '3. **Body-size scaling** — predator-prey body size ratios follow allometric rules that constrain link structure\n\n' +
        '**Allometric trophic network (ATN)** models simulate energy flow using body-size-based metabolic rates:\n\n' +
        '`dBi/dt = ri * Bi * (1 - Bi/Ki) - sum_j(xj * yj * Fji * Bj / eji)`\n\n' +
        'where Bi = biomass of species i, ri = intrinsic growth rate, Ki = carrying capacity, xj = mass-specific metabolic rate of consumer j, yj = maximum ingestion rate, Fji = functional response, eji = assimilation efficiency.\n\n' +
        '**Stable isotope analysis** (delta-13C and delta-15N) empirically maps trophic positions: each trophic step enriches 15N by ~3.4 per mil.\n\n' +
        '| Sample | delta-15N (per mil) | Calculated TL | Interpretation |\n' +
        '|--------|-------------------|---------------|----------------|\n' +
        '| River algae (baseline) | 2.0 | 1.0 | Primary producer |\n' +
        '| Hilsa fish muscle | 8.8 | 1 + (8.8 - 2.0)/3.4 = 3.0 | Secondary consumer |\n' +
        '| Tiger whisker | 13.6 | 1 + (13.6 - 2.0)/3.4 = 4.4 | Top predator |\n' +
        '| Fishing cat fur | 11.0 | 1 + (11.0 - 2.0)/3.4 = 3.6 | Carnivore |\n\n' +
        'This technique has confirmed that Bengal tigers in floodplain ecosystems occupy TL 3.4–4.4, consistent with a diet mixing herbivores and small carnivores.',
    },

    // ── Section 2: Food Chains vs Food Webs ─────────────────────
    {
      title: 'Food Chains vs Food Webs',
      diagram: 'FoodWebDiagram',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A food chain shows every feeding relationship in an ecosystem.', answer: false, explanation: 'A food chain shows only one linear path. A food WEB shows the full network of interconnected chains.' },
            { text: 'Food webs are more realistic than food chains because most animals eat multiple food sources.', answer: true, explanation: 'Correct — a tiger eats deer, boar, and sometimes fish. A single chain misses this complexity.' },
            { text: 'If one species goes extinct, a food web is more resilient than a food chain.', answer: true, explanation: 'The web provides alternative energy pathways. In a single chain, losing one link breaks the entire flow.' },
            { text: 'Food chains can be 10 or more links long in most ecosystems.', answer: false, explanation: 'The 10% rule means chains rarely exceed 4-5 links — there is not enough energy beyond that.' },
          ],
        },
      },
      beginnerContent:
        'A **food chain** is a simplified, linear sequence showing one path of energy transfer:\n\n' +
        '`Elephant grass → Swamp deer → Bengal tiger`\n\n' +
        'Each arrow means "is eaten by." Food chains are useful teaching tools, but they hide the real complexity. No animal eats just one thing, and no organism is eaten by just one predator.\n\n' +
        '**Analogy:** A food chain is like a single road on a map. A food web is the entire road network. If one road is blocked, a single-road map gives you no alternatives. A full map shows dozens of detour routes.\n\n' +
        'A **food web** is the network of all interconnected food chains. In a floodplain ecosystem, elephant grass feeds rhinos, wild buffalo, deer, and insects. Deer are eaten by tigers, leopards, and wild dogs. Insects are eaten by frogs, which are eaten by snakes, which are eaten by raptors. Fish in wetlands eat aquatic invertebrates and are eaten by otters, fishing cats, and kingfishers.\n\n' +
        '| Feature | Food chain | Food web |\n' +
        '|---------|-----------|----------|\n' +
        '| Structure | Linear (A → B → C) | Branching network |\n' +
        '| Realism | Oversimplified | Closer to reality |\n' +
        '| Number of paths | 1 | Dozens to hundreds |\n' +
        '| Resilience shown | None — one break = collapse | Alternative pathways visible |\n' +
        '| Useful for | Teaching basic concepts | Understanding ecosystem health |\n' +
        '| Example | Grass → deer → tiger | Grass feeds deer, boar, insects; tiger eats deer, boar, fish |\n\n' +
        '**Why webs matter for conservation:**\n\n' +
        'Food webs reveal vulnerabilities that chains hide. If a disease wiped out the deer population, tigers could shift to young buffalo or wild boar — the web provides alternatives. But if the elephant grass itself were destroyed by prolonged flooding or invasive species, the entire web collapses because the base producer is gone.\n\n' +
        '| Scenario | Food chain prediction | Food web prediction |\n' +
        '|----------|---------------------|--------------------|\n' +
        '| Deer population crashes | Tiger starves | Tiger switches to boar, young buffalo |\n' +
        '| Grass destroyed by flood | Entire chain collapses | Entire web collapses (base gone) |\n' +
        '| New invasive predator arrives | One prey species declines | Multiple prey species affected; ripple effects |\n' +
        '| Pollinator decline | One plant affected | Multiple plants fail; herbivores lose food |\n\n' +
        'The more connections in a food web, the more resilient the ecosystem. This is one of the strongest arguments for why **biodiversity matters** — each species is a strand in the web, and removing strands weakens the whole structure.\n\n' +
        '**Check yourself:** Draw a simple food web with grass, a grasshopper, a frog, a snake, and a hawk. How many food chains can you trace from grass to hawk? (Answer: 1 — but add a mouse that eats grass and is eaten by the snake, and you get 2 chains through the same web.)',
      intermediateContent:
        '**Network metrics in practice:**\n\n' +
        'Ecologists map food webs by combining gut-content analysis, stable isotope ratios, and direct observation. The resulting network can be analysed with graph theory.\n\n' +
        '**Worked example — small wetland web:**\n\n' +
        'Suppose a wetland has S = 12 species and L = 22 observed feeding links.\n\n' +
        '`Connectance = L / S^2 = 22 / 144 = 0.153`\n\n' +
        '`Link density = L / S = 22 / 12 = 1.83 links per species`\n\n' +
        '| Web type | Typical S | Typical L | Connectance | Link density |\n' +
        '|----------|-----------|-----------|-------------|-------------|\n' +
        '| Small pond | 10–20 | 15–40 | 0.10–0.20 | 1.5–2.5 |\n' +
        '| Grassland | 50–200 | 100–600 | 0.03–0.10 | 2–4 |\n' +
        '| Tropical forest | 100–500 | 300–2000 | 0.02–0.08 | 3–5 |\n' +
        '| Marine pelagic | 20–80 | 50–250 | 0.05–0.15 | 2–4 |\n\n' +
        '**Degree distribution** — the number of links per species — often follows a power law: most species have few links, but a handful of "hub" species (generalist predators, keystone species) have many. Removing hub species causes disproportionate damage to web connectivity, while removing random species has little effect. This is the network-theory basis for prioritising keystone species in conservation.',
      advancedContent:
        '**Cascade models vs. niche models:**\n\n' +
        'Early food-web models (Cohen & Newman, 1985) arranged species along a single "cascade" axis — larger species eat smaller ones. The **niche model** (Williams & Martinez, 2000) assigns each species a niche value ni and a feeding range ri, where species i eats all species j whose niche value falls within a contiguous interval of width ri centred below ni. This simple rule reproduces real food-web properties — degree distribution, clustering, short path lengths — far better than random graphs.\n\n' +
        '| Model | Parameters | Captures degree distribution? | Captures clustering? | Predicts stability? |\n' +
        '|-------|-----------|-----------------------------|--------------------|--------------------|\n' +
        '| Random (Erdos-Renyi) | S, C | No | No | May\'s result only |\n' +
        '| Cascade | S, C | Partially | No | Partially |\n' +
        '| Niche | S, C | Yes | Yes | Yes (with extensions) |\n' +
        '| Allometric (ATN) | S, C, body sizes | Yes | Yes | Yes — dynamic simulations |\n\n' +
        'The niche model predicts that **intervality** (the extent to which prey sets form contiguous groups along a single dimension) is a universal feature of food webs — confirmed empirically in >90% of published webs with S > 25.',
    },

    // ── Section 3: Trophic Levels and the 10% Rule ──────────────
    {
      title: 'Trophic Levels and the 10% Rule',
      diagram: 'EnergyPyramidDiagram',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'If producers fix 10,000 kcal and trophic efficiency is 10%, a tertiary consumer (level 4) receives only 10 kcal.', answer: true, explanation: 'Level 2 gets 1,000 kcal, level 3 gets 100 kcal, and level 4 gets 10 kcal — each step retains only 10%.' },
            { text: 'An organism uses most of the energy it consumes for growth and biomass.', answer: false, explanation: 'About 90% of consumed energy is lost to metabolism (movement, respiration, heat). Only ~10% becomes biomass available to the next level.' },
            { text: 'Top predators are rare partly because so little energy reaches the highest trophic levels.', answer: true, explanation: 'With only ~0.1% of original energy reaching level 4, ecosystems cannot support large populations of top predators.' },
            { text: 'Herbivores are at trophic level 1.', answer: false, explanation: 'Producers (plants, algae) are at trophic level 1. Herbivores occupy trophic level 2.' },
          ],
        },
      },
      beginnerContent:
        'Ecologists organise food webs into **trophic levels** (from the Greek *trophe*, meaning nourishment). Producers sit at level 1, herbivores at level 2, carnivores at level 3, and top predators at level 4 or 5.\n\n' +
        'Energy decreases dramatically at each step. When a swamp deer eats grass, it uses most of the energy for its own metabolism — moving, breathing, maintaining body temperature — and only about **10%** is converted into deer biomass. When a tiger eats the deer, the same thing happens.\n\n' +
        '**Analogy:** Imagine you earn Rs 10,000. You spend Rs 9,000 on rent, food, and bills (metabolism) and save Rs 1,000 (biomass). You give that Rs 1,000 to a friend, who also spends 90% and saves Rs 100. By the fourth person in the chain, there\'s only Rs 1 left.\n\n' +
        '| Trophic level | Example | Energy available | % of original |\n' +
        '|---------------|---------|-----------------|---------------|\n' +
        '| 1 — Producers | Elephant grass | 10,000 kcal/m^2/yr | 100% |\n' +
        '| 2 — Herbivores | Swamp deer, rhino | 1,000 kcal/m^2/yr | 10% |\n' +
        '| 3 — Carnivores | Bengal tiger, leopard | 100 kcal/m^2/yr | 1% |\n' +
        '| 4 — Apex predators | Fish eagle, crocodile | 10 kcal/m^2/yr | 0.1% |\n' +
        '| 5 — (rare) | Parasites on apex predators | 1 kcal/m^2/yr | 0.01% |\n\n' +
        '**Worked example — How many rhinos can a grassland feed?**\n\n' +
        'Suppose a grassland produces 5,000 kg of plant biomass per hectare per year. At 10% efficiency, this supports 500 kg of herbivore biomass. An adult rhino weighs ~2,000 kg. So one hectare supports `500 / 2,000 = 0.25` rhinos. A park with 40,000 hectares of grassland could theoretically support `40,000 x 0.25 = 10,000` rhinos (the actual number is lower due to habitat fragmentation, water needs, and territorial spacing).\n\n' +
        '| Ecosystem | Productivity (kg/ha/yr) | Herbivore biomass at 10% | Tiger-sized carnivores at 10% |\n' +
        '|-----------|------------------------|------------------------|------------------------------|\n' +
        '| Tropical grassland | 5,000 | 500 kg/ha | 50 kg/ha (~1 tiger per 40 ha) |\n' +
        '| Temperate forest | 3,000 | 300 kg/ha | 30 kg/ha |\n' +
        '| Desert scrub | 200 | 20 kg/ha | 2 kg/ha |\n' +
        '| Open ocean | 125 | 12.5 kg/ha | 1.25 kg/ha |\n\n' +
        'The 10% rule explains why food chains rarely exceed 4–5 links. By the fifth level, only 0.01% of the original energy remains — not enough to sustain a viable population.\n\n' +
        'It also explains why **eating lower on the food chain** is more efficient for humans. Growing grain and eating it directly captures 10x more energy per hectare than feeding the grain to cattle and eating beef.\n\n' +
        '**Check yourself:** If a lake produces 8,000 kcal of algae, and a fish eats the algae at 15% efficiency, and a human eats the fish at 10% efficiency, how many kcal does the human get? (`8,000 x 0.15 x 0.10 = 120 kcal`.)',
      intermediateContent:
        '**The 10% rule is an approximation.** Actual ecological efficiency (energy transferred between trophic levels) varies from 5% to 20% depending on the ecosystem and the organisms involved.\n\n' +
        'Ecological efficiency = Assimilation efficiency x Production efficiency x Consumption efficiency\n\n' +
        '**Worked example — comparing pathways:**\n\n' +
        'Path A (terrestrial): Grass → deer → tiger\n' +
        '- Deer assimilation: 30% (cellulose is hard to digest)\n' +
        '- Deer production: 2% (endotherm — high metabolic cost)\n' +
        '- Tiger consumption of deer: 80% (leaves bones, hide)\n' +
        '- Ecological efficiency, level 1→2: 0.30 x 0.02 x 0.80 = **0.48%**\n\n' +
        'Path B (aquatic): Algae → zooplankton → fish\n' +
        '- Zooplankton assimilation: 70% (no cellulose in algae)\n' +
        '- Zooplankton production: 20% (ectotherm — low metabolic cost)\n' +
        '- Fish consumption: 90% (swallows whole)\n' +
        '- Ecological efficiency, level 1→2: 0.70 x 0.20 x 0.90 = **12.6%**\n\n' +
        '| Factor | Increases efficiency | Decreases efficiency |\n' +
        '|--------|---------------------|---------------------|\n' +
        '| Body temperature | Ectotherm (no heating cost) | Endotherm (90%+ to metabolism) |\n' +
        '| Food quality | Animal tissue (80% digestible) | Plant cellulose (20-50%) |\n' +
        '| Consumption | Whole prey (90%+ eaten) | Partial (bones, shells left) |\n' +
        '| Activity level | Sedentary (ambush predator) | Active pursuit predator |\n\n' +
        'This is why aquatic food chains can support more trophic levels (sometimes 5-6) compared to terrestrial chains (typically 3-4). Ectothermic aquatic organisms waste less energy on metabolism, so more passes up the chain.\n\n' +
        '**Lindeman\'s efficiency across ecosystems:**\n\n' +
        '| Ecosystem | Level 1→2 | Level 2→3 | Level 3→4 | Overall (1→4) |\n' +
        '|-----------|-----------|-----------|-----------|---------------|\n' +
        '| Tropical grassland | 8% | 12% | 10% | 0.096% |\n' +
        '| Temperate lake | 15% | 18% | 15% | 0.405% |\n' +
        '| Open ocean | 20% | 15% | 10% | 0.300% |\n' +
        '| Coral reef | 12% | 10% | 8% | 0.096% |',
      advancedContent:
        '**Lindeman\'s trophic-dynamic model (1942)** formalized energy flow through trophic levels. The efficiency ratio lambda(n) = intake at level n / intake at level (n-1) defines energy transfer.\n\n' +
        '**Derivation — maximum food chain length:**\n\n' +
        'Let E0 = energy fixed by producers. At trophic level n, available energy = E0 x lambda^(n-1). A population is viable only if available energy exceeds a minimum threshold Emin (enough to sustain a breeding population). Maximum chain length:\n\n' +
        '`n_max = 1 + log(E0/Emin) / log(1/lambda)`\n\n' +
        '**Worked example:**\n\n' +
        'E0 = 10,000 kcal/m^2/yr, lambda = 0.10, Emin = 1 kcal/m^2/yr:\n\n' +
        '`n_max = 1 + log(10000/1) / log(1/0.1) = 1 + 4/1 = 5 levels`\n\n' +
        'With lambda = 0.20 (aquatic ecosystem):\n\n' +
        '`n_max = 1 + log(10000) / log(5) = 1 + 4/0.699 = 6.7 → 6 levels`\n\n' +
        '| lambda | E0 (kcal/m^2/yr) | Emin | Max chain length |\n' +
        '|--------|-----------------|------|------------------|\n' +
        '| 0.05 | 10,000 | 1 | 4.1 → 4 levels |\n' +
        '| 0.10 | 10,000 | 1 | 5.0 → 5 levels |\n' +
        '| 0.15 | 10,000 | 1 | 5.9 → 5 levels |\n' +
        '| 0.20 | 10,000 | 1 | 6.7 → 6 levels |\n' +
        '| 0.10 | 50,000 | 1 | 5.7 → 5 levels |\n\n' +
        'This explains the empirical observation (Post, 2002) that ecosystem size (which correlates with E0) is the strongest predictor of food chain length across ecosystems.',
    },

    // ── Section 4: Keystone Species ─────────────────────────────
    {
      title: 'Keystone Species and Ecosystem Engineers',
      diagram: 'ElephantEcosystemDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each keystone species to its ecosystem role',
          pairs: [
            ['Indian rhinoceros', 'Heavy grazing + trampling creates open patches in tall grass, enabling habitat for smaller animals'],
            ['Fig tree (Ficus)', 'Produces fruit year-round, sustaining hornbills, primates, and bats in lean seasons'],
            ['Asian elephant', 'Pushes over trees and creates clearings, maintaining grassland-forest mosaic'],
            ['Bengal tiger', 'Regulates herbivore populations, preventing overgrazing via trophic cascade'],
            ['Vultures', 'Remove carcasses rapidly, preventing disease spread from rotting remains'],
          ],
        },
      },
      beginnerContent:
        'A **keystone species** has an outsized effect on its ecosystem compared to its population size. Remove it, and the whole community structure shifts dramatically — just as removing the keystone from a stone arch causes the entire arch to collapse.\n\n' +
        '**Analogy:** Think of a football team. The star striker scores goals, but the team also needs the goalkeeper. Remove the goalkeeper and every game changes, even though there\'s only one of them. Keystone species are the goalkeepers of ecosystems.\n\n' +
        '| Keystone type | How it shapes the ecosystem | Example |\n' +
        '|---------------|---------------------------|----------|\n' +
        '| Keystone predator | Controls herbivore numbers, prevents overgrazing | Bengal tiger, wolf |\n' +
        '| Keystone herbivore | Creates habitat diversity through selective feeding | Indian rhinoceros |\n' +
        '| Ecosystem engineer | Physically reshapes the habitat | Asian elephant, beaver |\n' +
        '| Keystone mutualist | Provides critical services (pollination, seed dispersal) | Fig tree, honeybee |\n' +
        '| Keystone decomposer | Controls nutrient cycling rate | Vulture, dung beetle |\n\n' +
        'The Indian rhinoceros is a textbook **keystone herbivore**. Rhinos weigh over 2,000 kg and consume 50+ kg of grass daily. Their heavy grazing and trampling of tall elephant grass creates open patches where shorter grasses and herbs can grow. These clearings become habitat for hog deer, Indian hares, reptiles, and ground-nesting birds. Without rhino grazing, grasslands become an impenetrable wall of 6-metre-tall grass, drastically reducing habitat diversity.\n\n' +
        '**Asian elephants** are **ecosystem engineers** — they push over trees, strip bark, dig for water, and create trails. Their dung disperses seeds for dozens of plant species. A single elephant herd reshapes forest structure across hundreds of square kilometres.\n\n' +
        '| Species removed | Immediate effect | Cascade effect | Timescale |\n' +
        '|----------------|-----------------|----------------|----------|\n' +
        '| Tigers | Herbivore population explodes | Overgrazing → grassland degrades → soil erosion | 3–10 years |\n' +
        '| Rhinos | Tall grass dominates | Small mammals, birds, reptiles lose open habitat | 2–5 years |\n' +
        '| Vultures | Carcasses rot slowly | Disease outbreaks, feral dog population explodes | 1–3 years |\n' +
        '| Fig trees | Fruit shortage in lean season | Hornbills, bats, primates decline in dry months | 1–5 years |\n' +
        '| Bees | Pollination fails | Wildflower and crop reproduction collapses | 1–2 seasons |\n\n' +
        'India\'s vulture crisis is a real-world example. When diclofenac (a veterinary painkiller) poisoned 99% of vultures in the 1990s–2000s, carcasses rotted instead of being scavenged. Feral dog populations surged (feeding on the carcasses), leading to increased rabies cases in humans. One "minor" species removal had devastating consequences.\n\n' +
        '**Check yourself:** Why can\'t smaller herbivores like hog deer replace rhinos as keystone grazers? (Hint: think about body weight and grass height.)',
      intermediateContent:
        '**Trophic cascades — when predators control plants:**\n\n' +
        'A **trophic cascade** occurs when a predator indirectly affects producers by controlling herbivore populations. This is a top-down effect that ripples through the food web.\n\n' +
        '**Classic example — wolves in Yellowstone (1995):**\n\n' +
        'Wolf reintroduction → elk stopped lingering in valleys → willow and aspen regrew along rivers → beavers returned → beaver dams created ponds → fish, amphibians, songbirds recovered → even river channels stabilised.\n\n' +
        '| Trophic level | Without wolves | With wolves | Change |\n' +
        '|---------------|---------------|-------------|--------|\n' +
        '| Predators | 0 wolves | 100+ wolves | — |\n' +
        '| Herbivores | Elk overgrazing everywhere | Elk avoid valleys, stay alert | -40% browsing pressure |\n' +
        '| Producers | Willows browsed to stumps | Willows grew 3+ metres tall | 5x height increase |\n' +
        '| Engineers | No beavers (no willows) | Beaver colonies returned | 0 → 12 colonies |\n' +
        '| Hydrology | Eroding riverbanks | Stable channels, new ponds | Measurable change |\n\n' +
        '**Worked example — tiger density and grassland health:**\n\n' +
        'Consider a 100 km^2 grassland. With 5 tigers (5 per 100 km^2), each tiger kills ~50 deer/year = 250 deer removed. Deer population stabilises at ~2,000, grazing pressure stays within grass regeneration capacity.\n\n' +
        'Remove the tigers: deer population grows to ~6,000 within 5 years (limited only by food). Grazing pressure triples. Grass biomass drops by 60%. Soil exposure increases, leading to erosion during monsoon floods.\n\n' +
        '| Tiger density (per 100 km^2) | Deer kills/year | Stable deer population | Grass biomass (%) |\n' +
        '|----------------------------|----------------|----------------------|------------------|\n' +
        '| 0 | 0 | ~6,000 | 40% (overgrazed) |\n' +
        '| 3 | 150 | ~3,500 | 70% |\n' +
        '| 5 | 250 | ~2,000 | 100% (healthy) |\n' +
        '| 8 | 400 | ~1,000 | 100% (undergrazed) |',
      advancedContent:
        '**Power\'s operational definition (1996):**\n\n' +
        'A keystone species is one whose effect on the community is disproportionately large relative to its biomass. Formally:\n\n' +
        '`Community Importance (CI) = [(trait_with - trait_without) / trait_with] / [biomass_proportion]`\n\n' +
        'If CI >> 1, the species is a keystone. If CI ≈ 1, its effect is proportional to its biomass (dominant, not keystone).\n\n' +
        '**Worked example — rhino as keystone:**\n\n' +
        'Rhinos comprise ~2% of herbivore biomass in a grassland. Removing them reduces habitat heterogeneity (measured as Shannon diversity of microhabitats) from H\' = 2.8 to H\' = 1.6.\n\n' +
        '`CI = [(2.8 - 1.6) / 2.8] / 0.02 = 0.429 / 0.02 = 21.4`\n\n' +
        'CI = 21.4 >> 1, confirming the rhino is a keystone species. For comparison, small deer might have CI ≈ 0.8–1.2 (proportional effect).\n\n' +
        '| Species | Biomass proportion | Community change on removal | CI value | Classification |\n' +
        '|---------|-------------------|---------------------------|----------|---------------|\n' +
        '| Rhino | 2% | 43% habitat diversity loss | 21.4 | Strong keystone |\n' +
        '| Tiger | 0.1% | 35% herbivore increase | 35.0 | Strong keystone |\n' +
        '| Swamp deer | 15% | 8% grazing change | 0.53 | Dominant, not keystone |\n' +
        '| Fig tree | 0.5% | 25% frugivore decline | 50.0 | Critical keystone |',
    },

    // ── Section 5: Bioaccumulation and Biomagnification ─────────
    {
      title: 'Bioaccumulation and Biomagnification',
      diagram: 'HilsaPopulationDiagram',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Bioaccumulation means a toxin becomes more concentrated at higher trophic levels.', answer: false, explanation: 'That\'s biomagnification. Bioaccumulation is the buildup within a SINGLE organism over its lifetime.' },
            { text: 'Mercury levels in a fish eagle can be millions of times higher than in the surrounding water.', answer: true, explanation: 'Each trophic level concentrates mercury further — water → algae → small fish → large fish → eagle.' },
            { text: 'DDT biomagnification nearly caused the extinction of peregrine falcons.', answer: true, explanation: 'DDT thinned eggshells, causing reproductive failure. Populations crashed until DDT was banned.' },
            { text: 'If you stop releasing a pollutant, biomagnification effects disappear immediately.', answer: false, explanation: 'Persistent chemicals can take decades to clear from ecosystems. DDT is still detectable 50+ years after banning.' },
            { text: 'Humans are vulnerable to biomagnification because we are top predators.', answer: true, explanation: 'Humans who eat large predatory fish (tuna, swordfish) accumulate mercury through the same process.' },
          ],
        },
      },
      beginnerContent:
        '**Bioaccumulation** and **biomagnification** are two related but distinct processes that explain why top predators — including humans — are most vulnerable to pollution.\n\n' +
        '**Analogy:** Imagine you have a jar of water with 1 drop of ink in it. You can barely see the colour. Now pour 100 of those jars into one jar (evaporating the water but keeping the ink). That one jar now has 100 drops of ink — it\'s deeply coloured. That\'s biomagnification: each step concentrates the substance further.\n\n' +
        '| Process | What happens | Scale | Example |\n' +
        '|---------|-------------|-------|---------|\n' +
        '| Bioaccumulation | One organism absorbs a toxin faster than it excretes it | Within a single organism\'s lifetime | A fish absorbs mercury from water over 5 years |\n' +
        '| Biomagnification | Toxin concentration increases at each trophic level | Across the entire food web | Mercury: water → algae → small fish → large fish → eagle |\n\n' +
        '**How it works step by step:**\n\n' +
        'A river near a coal mine contains mercury at 0.001 parts per million (ppm) — a tiny, seemingly harmless amount. But organisms at each level concentrate it:\n\n' +
        '| Trophic level | Organism | Mercury concentration (ppm) | Magnification factor |\n' +
        '|---------------|----------|--------------------------|---------------------|\n' +
        '| Water | — | 0.001 | 1x |\n' +
        '| 1 — Producer | Algae | 0.01 | 10x |\n' +
        '| 2 — Primary consumer | Minnow (eats algae) | 0.1 | 100x |\n' +
        '| 3 — Secondary consumer | Hilsa fish (eats minnows) | 1.0 | 1,000x |\n' +
        '| 4 — Tertiary consumer | Fishing cat (eats hilsa) | 10.0 | 10,000x |\n' +
        '| 4+ — Apex | Fish eagle (eats large fish) | 25.0 | 25,000x |\n\n' +
        '**Worked example — mercury in a river food web:**\n\n' +
        'A small fish eats 100 g of algae per day. The algae contains 0.01 ppm mercury. The fish absorbs 80% and excretes only 10%. Daily mercury retained: `100 x 0.00001 x 0.80 x 0.90 = 0.00072 mg`. Over one year: `0.00072 x 365 = 0.263 mg`. In a 50 g fish, that\'s `0.263 / 0.050 = 5.26 ppm` — 526 times the water concentration.\n\n' +
        'A hilsa fish eats 10 small fish per day, each containing 5 ppm mercury. Daily intake: `10 x 50 g x 0.00526 mg/g = 2.63 mg`. Even with 50% excretion, the hilsa accumulates mercury rapidly. Communities that depend on river fish as a primary protein source — common along the Brahmaputra and its tributaries — are directly exposed to this magnified contamination.\n\n' +
        '| Pollutant | Persists in environment? | Biomagnifies? | Major source | Human health risk |\n' +
        '|-----------|------------------------|--------------|--------------|------------------|\n' +
        '| Mercury (Hg) | Yes — decades | Yes — fat-soluble | Coal mining, industrial waste | Neurological damage |\n' +
        '| DDT | Yes — decades | Yes — fat-soluble | Agricultural pesticide (now banned) | Eggshell thinning, cancer risk |\n' +
        '| Lead (Pb) | Yes — centuries | Moderate | Mining, old paint, batteries | Brain development |\n' +
        '| PCBs | Yes — decades | Yes — fat-soluble | Industrial coolants (banned) | Immune system, cancer |\n' +
        '| Microplastics | Yes — centuries | Under research | Plastic waste in rivers | Physical damage, chemical leaching |\n\n' +
        '**Check yourself:** If mercury in water is 0.001 ppm and each trophic level magnifies it by 10x, what\'s the concentration at trophic level 4? (`0.001 x 10 x 10 x 10 = 1.0 ppm`.) Is this safe to eat regularly? (FDA limit for fish is 1.0 ppm — so this is right at the danger threshold.)',
      intermediateContent:
        '**Biomagnification factor (BMF)** quantifies how much a substance concentrates between trophic levels:\n\n' +
        '`BMF = [concentration in predator] / [concentration in prey]`\n\n' +
        'A BMF > 1 means the substance biomagnifies. A BMF < 1 means it dilutes.\n\n' +
        '**Worked example — DDT in a grassland food web:**\n\n' +
        '| Level | Organism | DDT concentration (ppm) | BMF (vs. level below) |\n' +
        '|-------|----------|------------------------|----------------------|\n' +
        '| Soil | — | 0.05 | — |\n' +
        '| 1 | Grass | 0.5 | 10.0 |\n' +
        '| 2 | Grasshopper | 2.0 | 4.0 |\n' +
        '| 3 | Frog | 12.0 | 6.0 |\n' +
        '| 4 | Snake | 50.0 | 4.2 |\n' +
        '| 5 | Hawk | 200.0 | 4.0 |\n\n' +
        'Overall magnification from soil to hawk: `200 / 0.05 = 4,000x`.\n\n' +
        'The **trophic magnification factor (TMF)** is the antilog of the slope of log[concentration] vs. trophic level. For mercury in freshwater systems, TMF typically ranges from 3 to 10, meaning mercury concentration increases 3–10x per trophic level.\n\n' +
        '**Bioconcentration factor (BCF)** measures uptake from water alone (no food):\n\n' +
        '`BCF = [concentration in organism] / [concentration in water]`\n\n' +
        '| Substance | log BCF (fish) | Biomagnifies? | Reason |\n' +
        '|-----------|---------------|--------------|--------|\n' +
        '| Mercury (methylHg) | 3.0–4.0 | Yes | Lipophilic, slow excretion |\n' +
        '| DDT | 4.5–5.0 | Yes | Extremely lipophilic |\n' +
        '| Caffeine | 0.1 | No | Hydrophilic, rapidly excreted |\n' +
        '| Ethanol | -0.3 | No | Metabolised quickly |\n\n' +
        'Substances with log BCF > 3.5 and log Kow (octanol-water partition coefficient) > 5 are strong biomagnifiers. This is the chemical basis for why fat-soluble pollutants are so dangerous.',
      advancedContent:
        '**Pharmacokinetic modelling of bioaccumulation:**\n\n' +
        'The one-compartment model for toxicant accumulation in an organism:\n\n' +
        '`dC/dt = k_uptake x C_water - k_elimination x C_organism`\n\n' +
        'At steady state (dC/dt = 0):\n\n' +
        '`BCF = C_organism / C_water = k_uptake / k_elimination`\n\n' +
        'For dietary exposure, the biota-sediment accumulation factor (BSAF) adds food intake:\n\n' +
        '`dC/dt = (k_w x C_water) + (k_food x C_food x AE) - (k_e + k_g + k_m) x C_org`\n\n' +
        'where AE = assimilation efficiency, k_g = growth dilution rate, k_m = metabolic transformation rate.\n\n' +
        '**Worked example — methylmercury in a river system:**\n\n' +
        'Given: k_uptake = 500 L/kg/day, k_elimination = 0.01/day, C_water = 0.001 mg/L\n\n' +
        '`BCF = 500 / 0.01 = 50,000`\n' +
        '`Steady-state C_fish = 50,000 x 0.001 = 50 mg/kg`\n\n' +
        'Time to reach 95% of steady state: `t_95 = ln(20) / k_e = 3.0 / 0.01 = 300 days`\n\n' +
        '| Parameter | Methylmercury | DDT | PCB-153 |\n' +
        '|-----------|--------------|-----|--------|\n' +
        '| Half-life in fish (days) | 200 | 150 | 300 |\n' +
        '| k_elimination (1/day) | 0.0035 | 0.0046 | 0.0023 |\n' +
        '| log Kow | 1.7 (MeHg) | 6.9 | 6.9 |\n' +
        '| Typical BMF | 4–8 | 3–10 | 5–15 |\n' +
        '| Human half-life | 70 days | 7 years | 10 years |',
    },

    // ── Section 6: Energy Flow in Aquatic Ecosystems ────────────
    {
      title: 'Energy Flow in Aquatic Ecosystems',
      diagram: 'LoktakSangaiDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each aquatic producer to its ecosystem',
          pairs: [
            ['Phytoplankton', 'Open water — microscopic floating algae that produce ~50% of Earth\'s oxygen'],
            ['Submerged macrophytes', 'Lake beds — rooted plants like hydrilla that shelter fish fry'],
            ['Floating vegetation (phumdi)', 'Loktak Lake — unique floating mats of organic matter supporting the sangai deer'],
            ['Mangrove roots', 'Coastal estuaries — nursery habitat for juvenile fish and shrimp'],
            ['Periphyton (biofilm algae)', 'Rocks and sediment — thin films of algae grazed by snails and insect larvae'],
          ],
        },
      },
      beginnerContent:
        'Water covers 71% of Earth\'s surface, and aquatic food webs produce roughly half of the planet\'s biomass. But aquatic energy flow follows different rules than terrestrial ecosystems.\n\n' +
        '**Analogy:** Terrestrial food webs are like forests — the producers (trees) are large, long-lived, and accumulate huge standing biomass. Aquatic food webs are like factories — the producers (phytoplankton) are tiny, reproduce in hours, and never accumulate much standing stock. The factory might produce the same total output as the forest, but at any moment it holds very little inventory.\n\n' +
        '| Feature | Terrestrial ecosystem | Aquatic ecosystem |\n' +
        '|---------|----------------------|-------------------|\n' +
        '| Dominant producers | Trees, grasses (large, long-lived) | Phytoplankton (microscopic, days-lived) |\n' +
        '| Standing biomass | High — forests store decades of growth | Low — plankton turnover in days |\n' +
        '| Productivity rate | Moderate | Can be very high (upwelling zones) |\n' +
        '| Trophic efficiency | 5–10% (endotherms dominate upper levels) | 10–20% (ectotherms at most levels) |\n' +
        '| Typical chain length | 3–4 links | 4–6 links |\n' +
        '| Inverted biomass pyramid? | Never | Common — zooplankton > phytoplankton at any moment |\n\n' +
        '**The inverted pyramid explained:**\n\n' +
        'In a lake or ocean, you might find that the total biomass of zooplankton (level 2) exceeds the biomass of phytoplankton (level 1) at any given moment. This seems to violate the 10% rule — but it doesn\'t. Phytoplankton reproduce so fast (doubling every 1-2 days) that their **productivity** far exceeds their **standing stock**. It\'s like a small bakery that bakes 1,000 loaves per day but never has more than 50 on the shelf.\n\n' +
        'Loktak Lake in Manipur is a remarkable example of aquatic energy flow. Its famous **phumdi** — floating mats of decomposing vegetation — form a unique habitat. The phumdi supports the critically endangered sangai (brow-antlered deer), the only deer in the world that lives on floating vegetation. The food web runs: phumdi vegetation → sangai deer → (historically) leopard/wild dog.\n\n' +
        '| Aquatic zone | Key producers | Key consumers | Energy pathway |\n' +
        '|-------------|--------------|---------------|----------------|\n' +
        '| Sunlit surface (photic) | Phytoplankton, floating plants | Zooplankton, small fish | Plankton → fish → birds |\n' +
        '| Lake bottom (benthic) | Periphyton, rooted plants | Snails, insect larvae, crabs | Algae → invertebrates → fish |\n' +
        '| Wetland margins | Reeds, sedges, water hyacinth | Frogs, water birds, turtles | Plants → insects → frogs → snakes |\n' +
        '| Floating mats (phumdi) | Decomposing vegetation, grasses | Sangai deer, birds, insects | Phumdi → herbivores → raptors |\n\n' +
        '**Check yourself:** Why can aquatic food chains be longer (5-6 links) than terrestrial ones (3-4 links)? (Hint: think about the metabolic costs of ectotherms vs. endotherms.)',
      intermediateContent:
        '**Comparing energy budgets — terrestrial vs. aquatic:**\n\n' +
        '**Worked example — wetland energy budget:**\n\n' +
        'A productive wetland receives solar radiation of 5,000,000 kcal/m^2/yr. Producers capture 1% = 50,000 kcal (gross primary production). They respire 60% = 30,000 kcal. Net primary production = 20,000 kcal/m^2/yr.\n\n' +
        '| Energy flow component | Amount (kcal/m^2/yr) | % of solar input |\n' +
        '|----------------------|---------------------|------------------|\n' +
        '| Solar radiation | 5,000,000 | 100% |\n' +
        '| Gross primary production (GPP) | 50,000 | 1.0% |\n' +
        '| Producer respiration | 30,000 | 0.6% |\n' +
        '| Net primary production (NPP) | 20,000 | 0.4% |\n' +
        '| Herbivore ingestion | 4,000 | 0.08% |\n' +
        '| Herbivore production | 800 | 0.016% |\n' +
        '| Carnivore production | 80 | 0.0016% |\n' +
        '| Top predator production | 8 | 0.00016% |\n\n' +
        '**The microbial loop:**\n\n' +
        'In aquatic systems, a significant fraction (30-50%) of primary production enters the **microbial loop** rather than the classical grazing chain. Dissolved organic matter (DOM) released by phytoplankton is consumed by bacteria, which are eaten by protists (flagellates, ciliates), which are eaten by zooplankton. This loop recycles energy and nutrients that would otherwise be lost.\n\n' +
        '| Pathway | % of primary production | Trophic levels involved | Net efficiency |\n' +
        '|---------|----------------------|------------------------|----------------|\n' +
        '| Classical grazing chain | 50–70% | Phytoplankton → zooplankton → fish | 10–20% per level |\n' +
        '| Microbial loop | 30–50% | DOM → bacteria → protists → zooplankton | ~5% per level |\n' +
        '| Viral shunt | 10–20% | Viral lysis returns cell contents to DOM | Recycling, not transfer |\n\n' +
        'The microbial loop means aquatic food webs have a hidden layer of complexity that terrestrial webs largely lack.',
      advancedContent:
        '**Odum\'s energy flow model (1957) — Silver Springs, Florida:**\n\n' +
        'H.T. Odum\'s landmark study of Silver Springs quantified every energy pathway in a complete aquatic ecosystem.\n\n' +
        '| Component | GPP (kcal/m^2/yr) | Respiration | Export | Efficiency |\n' +
        '|-----------|-------------------|-------------|--------|------------|\n' +
        '| Producers | 20,810 | 11,977 | 460 | — |\n' +
        '| Herbivores | 3,368 | 1,890 | — | 16.2% |\n' +
        '| Primary carnivores | 383 | 316 | — | 11.4% |\n' +
        '| Secondary carnivores | 21 | 13 | — | 5.5% |\n' +
        '| Decomposers | 5,060 | 4,600 | — | — |\n\n' +
        'Key insight: decomposers processed more energy than the entire consumer chain. This is typical — in most ecosystems, the detrital pathway dominates energy flow.\n\n' +
        '**Net ecosystem production (NEP):**\n\n' +
        '`NEP = GPP - R_ecosystem = GPP - (R_autotroph + R_heterotroph)`\n\n' +
        'If NEP > 0, the ecosystem is a net carbon sink (accumulating organic matter). If NEP < 0, it\'s a net carbon source. Wetlands are among the highest NEP systems globally, which is why they are critical carbon stores — and why draining wetlands releases massive amounts of CO2.\n\n' +
        '| Ecosystem | GPP | R_total | NEP | Carbon status |\n' +
        '|-----------|-----|---------|-----|---------------|\n' +
        '| Productive wetland | 20,000 | 18,000 | +2,000 | Strong carbon sink |\n' +
        '| Oligotrophic lake | 3,000 | 3,200 | -200 | Slight carbon source |\n' +
        '| Eutrophic lake | 12,000 | 11,500 | +500 | Moderate carbon sink |\n' +
        '| Open ocean | 1,500 | 1,480 | +20 | Near-neutral |',
    },

    // ── Section 7: Decomposition and Nutrient Cycling ───────────
    {
      title: 'Decomposition and Nutrient Cycling',
      diagram: 'BeeEcosystemServiceDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each decomposition factor to its effect',
          pairs: [
            ['Temperature increase of 10°C', 'Decomposition rate roughly doubles (Q10 = 2)'],
            ['Fungi (saprotrophs)', 'Break down tough lignin and cellulose in wood'],
            ['Bacteria', 'Dominate decomposition in waterlogged, anaerobic soils'],
            ['Detritivores (earthworms, millipedes)', 'Fragment litter, increasing surface area for microbes'],
            ['Nutrients cycle', 'The same atoms are reused endlessly across organisms'],
          ],
        },
      },
      beginnerContent:
        'Energy flows through an ecosystem in one direction — from sun to producers to consumers to heat. But **nutrients cycle**. The same carbon atom in a blade of grass today might have been in a dinosaur 100 million years ago, then in ocean sediment, then in limestone, then in volcanic CO2, then absorbed by that grass.\n\n' +
        '**Analogy:** Energy is like water flowing downhill — it only goes one way and eventually dissipates. Nutrients are like a library book — they get checked out, used, returned, and checked out again by someone new. The book (atom) is never destroyed, just continuously reused.\n\n' +
        '| Nutrient | Role in organisms | Key reservoir | How it enters food web | How it leaves organisms |\n' +
        '|----------|------------------|---------------|----------------------|------------------------|\n' +
        '| Carbon (C) | Backbone of all organic molecules | Atmosphere (CO2), oceans | Photosynthesis | Respiration, decomposition |\n' +
        '| Nitrogen (N) | Proteins, DNA | Atmosphere (N2, 78%) | Nitrogen-fixing bacteria | Decomposition, denitrification |\n' +
        '| Phosphorus (P) | DNA, ATP, bones | Rock, sediment | Weathering of rocks | Decomposition |\n' +
        '| Potassium (K) | Cell function, enzyme activation | Soil minerals | Root uptake | Decomposition, leaching |\n\n' +
        '**Decomposition — the engine of recycling:**\n\n' +
        'When an organism dies, decomposers break it down in stages:\n\n' +
        '| Stage | Time after death | What happens | Main decomposers |\n' +
        '|-------|-----------------|-------------|------------------|\n' +
        '| Fresh | 0–2 days | Cells break down (autolysis), gases released | Bacteria |\n' +
        '| Bloat | 2–6 days | Bacterial gas production, strong odour | Anaerobic bacteria |\n' +
        '| Active decay | 6–30 days | Soft tissue consumed, nutrients released to soil | Bacteria, fly larvae, beetles |\n' +
        '| Advanced decay | 1–6 months | Only tough materials (hair, bone, wood) remain | Fungi, termites |\n' +
        '| Skeletal/mineral | 6 months–years | Minerals return to soil | Fungi, weathering |\n\n' +
        'In warm, humid environments like the Brahmaputra floodplain, decomposition is rapid — a fallen tree becomes soil in just 3-5 years. In cold or dry environments, the same process takes decades. This is why tropical soils are nutrient-poor despite lush growth: nutrients are recycled so fast they\'re always locked in living biomass, not stored in soil.\n\n' +
        '| Climate zone | Leaf litter decomposition time | Soil organic carbon | Why? |\n' +
        '|-------------|-------------------------------|--------------------|---------|\n' +
        '| Tropical humid | 2–6 months | Low (fast recycling) | Warm + wet = fast microbial activity |\n' +
        '| Temperate | 1–3 years | Moderate | Seasonal slowdown in winter |\n' +
        '| Boreal/taiga | 5–20 years | High (peat builds up) | Cold slows decomposition |\n' +
        '| Desert | 10–50 years | Very low | Dry = no microbial activity |\n\n' +
        '**Check yourself:** Why does a compost pile heat up? (Answer: decomposer microbes release heat energy as they break down organic matter — the same metabolic heat that keeps your body warm.)',
      intermediateContent:
        '**The Q10 rule and decomposition rates:**\n\n' +
        'Decomposition rate approximately doubles with every 10 degrees C increase in temperature (Q10 ≈ 2). This has massive implications for climate change.\n\n' +
        '**Worked example — climate warming and soil carbon:**\n\n' +
        'A boreal forest stores 200 tonnes of carbon per hectare in soil. Current mean temperature: 5 degrees C. Decomposition rate constant: k = 0.02/year (half-life = 35 years).\n\n' +
        'If climate warming raises temperature by 3 degrees C:\n\n' +
        '`Q10 factor = 2^(3/10) = 2^0.3 = 1.23`\n' +
        '`New k = 0.02 x 1.23 = 0.0246/year`\n' +
        '`Extra carbon released per year = 200 x (0.0246 - 0.02) = 0.92 tonnes C/ha/yr`\n\n' +
        'Scaled across 1.2 billion hectares of boreal forest globally: `0.92 x 1.2 billion = 1.1 billion tonnes C/yr` — comparable to ~10% of human fossil fuel emissions. This is the **soil carbon feedback** that could accelerate warming.\n\n' +
        '| Temperature increase | Q10 factor | New k | Extra C released (t/ha/yr) |\n' +
        '|---------------------|-----------|-------|---------------------------|\n' +
        '| +1 degrees C | 1.07 | 0.0214 | 0.28 |\n' +
        '| +2 degrees C | 1.15 | 0.0230 | 0.60 |\n' +
        '| +3 degrees C | 1.23 | 0.0246 | 0.92 |\n' +
        '| +5 degrees C | 1.41 | 0.0282 | 1.64 |\n\n' +
        '**Nutrient stoichiometry — the Redfield ratio:**\n\n' +
        'In aquatic systems, phytoplankton maintain a remarkably consistent ratio of C:N:P = 106:16:1 (the **Redfield ratio**). This constrains which nutrient limits growth:\n\n' +
        '| Measured N:P ratio | Limiting nutrient | Implication |\n' +
        '|-------------------|------------------|-------------|\n' +
        '| < 16 | Nitrogen limits growth | Adding N boosts production |\n' +
        '| = 16 | Both co-limit | Balanced system |\n' +
        '| > 16 | Phosphorus limits growth | Adding P boosts production (eutrophication risk) |\n\n' +
        'Most freshwater systems are phosphorus-limited (N:P > 16), which is why phosphorus from detergents, fertilisers, and sewage causes algal blooms. Reducing phosphorus input is the most effective way to combat eutrophication in lakes and wetlands.',
      advancedContent:
        '**Decomposition kinetics — the exponential decay model:**\n\n' +
        '`M(t) = M0 x e^(-k x t)`\n\n' +
        'where M0 = initial mass, k = decomposition rate constant, t = time.\n\n' +
        '**Worked example — leaf litter decay:**\n\n' +
        '100 g of leaf litter in a tropical floodplain. k = 1.5/year (fast decomposition).\n\n' +
        'After 6 months (t = 0.5): `M = 100 x e^(-1.5 x 0.5) = 100 x e^(-0.75) = 100 x 0.472 = 47.2 g`\n' +
        'After 1 year: `M = 100 x e^(-1.5) = 100 x 0.223 = 22.3 g`\n' +
        'After 2 years: `M = 100 x e^(-3.0) = 100 x 0.050 = 5.0 g`\n\n' +
        '| Ecosystem | k (per year) | Half-life (years) | 95% decomposition (years) |\n' +
        '|-----------|-------------|-------------------|-------------------------|\n' +
        '| Tropical floodplain | 1.5 | 0.46 | 2.0 |\n' +
        '| Temperate deciduous | 0.5 | 1.39 | 6.0 |\n' +
        '| Boreal forest | 0.05 | 13.9 | 60 |\n' +
        '| Peat bog | 0.005 | 139 | 600 |\n\n' +
        'Half-life = ln(2)/k. Time to 95% decomposition = ln(20)/k = 3/k.\n\n' +
        '**The humification index:**\n\n' +
        'Not all organic matter decomposes completely. A fraction (5-30%) becomes **humus** — stable organic compounds resistant to further decomposition. The humification coefficient (h) modifies the model:\n\n' +
        '`M_labile(t) = M0(1-h) x e^(-k x t)`\n' +
        '`M_humus = M0 x h` (stable fraction, persists for centuries)\n\n' +
        '| Litter type | h (humification coefficient) | k (labile fraction) | Long-term soil C contribution |\n' +
        '|-------------|----------------------------|--------------------|--------------------------|\n' +
        '| Grass leaves | 0.05 | 2.0 | Low — fast decay, little humus |\n' +
        '| Hardwood leaves | 0.15 | 0.5 | Moderate |\n' +
        '| Conifer needles | 0.25 | 0.2 | High — acidic, slow, much humus |\n' +
        '| Peat moss (Sphagnum) | 0.30 | 0.01 | Very high — peat accumulation |',
    },
  ],
};
