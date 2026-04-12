import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'food-webs-energy-flow',
  title: 'Food Webs & Energy Flow',
  category: 'ecology',
  icon: '🌿',
  tagline: 'Who eats whom — how energy flows from sunlight through every living thing.',
  relatedStories: ['kaziranga-grass', 'elephant-corridor', 'golden-hilsa'],
  understand: [
    {
      title: 'Producers, Consumers, and Decomposers',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each role to its definition',
          pairs: [
            ['Producers (autotrophs)', 'Capture solar energy through photosynthesis — grasses, algae, phytoplankton'],
            ['Primary consumers (herbivores)', 'Eat producers directly — rhinos, deer, buffalo'],
            ['Secondary consumers (carnivores)', 'Eat herbivores — tigers, leopards'],
            ['Decomposers', 'Break down dead matter, recycling nutrients — fungi, bacteria, earthworms'],
          ],
        },
      },
      beginnerContent: 'Every ecosystem runs on energy that originates from the Sun. **Producers** (autotrophs) — primarily green plants, algae, and cyanobacteria — capture solar energy through photosynthesis and convert it into chemical energy stored in glucose. In Kaziranga National Park, the vast stretches of elephant grass (*Saccharum ravennae* and *S. spontaneum*) are the dominant producers, converting monsoon sunlight and Brahmaputra-deposited nutrients into biomass that sustains the entire food web. Aquatic algae and phytoplankton in the park\'s wetlands (beels) form a parallel base of production.\n\n**Primary consumers** (herbivores) eat producers directly. Kaziranga\'s Indian one-horned rhinoceros, wild water buffalo, swamp deer (barasingha), and hog deer are all primary consumers that graze on the park\'s grasslands. **Secondary consumers** (carnivores that eat herbivores) include Kaziranga\'s Bengal tigers, which prey on deer and young buffalo. **Tertiary consumers** sit atop the chain — large raptors like the Pallas\'s fish eagle that eat fish that ate insects that ate algae.\n\n**Decomposers** — fungi, bacteria, and invertebrates like earthworms and dung beetles — break down dead organisms and waste, releasing nutrients back into the soil and water. Without decomposers, dead matter would pile up and nutrients would remain locked away, unavailable to producers. In Kaziranga\'s warm, humid environment, decomposition is rapid: a fallen tree can be reduced to soil in just a few years, recycling its carbon, nitrogen, and phosphorus back into the grassland ecosystem.',
      intermediateContent:
        'Ecologists quantify food-web structure with metrics like **connectance** (proportion of possible feeding links that actually exist), **link density** (average number of links per species), and **trophic level** (calculated as 1 + the mean trophic level of prey). In Kaziranga’s food web, the Bengal tiger has a trophic level of about 3.5 (it eats both herbivores at level 2 and omnivores at level 2.5). The **assimilation efficiency** (energy absorbed/energy ingested) differs by diet: herbivores assimilate ~20–50% of plant material (cellulose is hard to digest), while carnivores assimilate ~80% of animal tissue. **Production efficiency** (new biomass/energy assimilated) is ~1–3% for endotherms (most energy fuels metabolism) versus 10–25% for ectotherms. The **Elton pyramid** of body sizes predicts that predators are generally larger than prey and less numerous, forming the classic triangular shape.',
      advancedContent:
        'Modern food-web ecology uses **network theory** to analyse stability. Robert May’s 1972 paradox showed that increasing complexity (more species, more connections) should destabilise ecosystems, contradicting the observed stability of diverse systems. Resolution came from recognising that real food webs have non-random structure: **weak interactions** (many links of low strength) stabilise webs by dampening oscillations (McCann et al., 1998). **Allometric trophic network (ATN)** models simulate energy flow using body-size-based metabolic rates and functional responses, predicting population dynamics and extinction cascades. **Stable isotope analysis** (δ¹³C and δ¹⁵N) empirically maps trophic positions: each trophic step enriches ¹⁵N by ~3.4‰, so a tissue δ¹⁵N of 12‰ indicates a trophic level of about 3.5 above the baseline. This technique has confirmed that Kaziranga’s tigers occupy trophic level 3.4–3.8, consistent with a mixed diet of herbivores and omnivores.',
    },
    {
      title: 'Food Chains vs Food Webs',
      beginnerContent: 'A **food chain** is a simplified, linear sequence showing one path of energy transfer: elephant grass → swamp deer → Bengal tiger. Each arrow means "is eaten by." Food chains are useful for illustrating basic energy flow, but they oversimplify reality. No animal eats just one thing, and no organism is eaten by just one predator.\n\nA **food web** is the network of all interconnected food chains in an ecosystem. In Kaziranga, elephant grass feeds rhinos, wild buffalo, deer, and countless insects. Rhinos are too large for most predators but their calves are vulnerable to tigers. Deer are eaten by tigers, leopards, and wild dogs. Insects are eaten by frogs, which are eaten by snakes, which are eaten by raptors. Fish in the beels eat aquatic invertebrates and are eaten by otters, fishing cats, and kingfishers. The web is dense and tangled.\n\nFood webs reveal vulnerabilities that food chains hide. If a disease wiped out Kaziranga\'s deer population, tigers could shift to young buffalo or wild boar — the web provides alternative pathways. But if the elephant grass itself were destroyed (by prolonged flooding, invasive species, or land conversion), the entire web would collapse because the base producer is gone. The more connections in a food web, the more resilient the ecosystem — which is why biodiversity matters for stability.',
      diagram: 'FoodWebDiagram',
    },
    {
      title: 'Trophic Levels and the 10% Rule',
      diagram: 'EnergyPyramidDiagram',
      beginnerContent: 'Ecologists organize food webs into **trophic levels**: producers occupy level 1, primary consumers level 2, secondary consumers level 3, and so on. Energy decreases dramatically at each step. When a swamp deer eats grass, it uses most of the energy for its own metabolism — moving, breathing, maintaining body temperature — and only about 10% is converted into deer biomass. When a tiger eats the deer, the same thing happens: roughly 10% becomes tiger biomass.\n\nThis is the **10% rule** (more precisely, ecological efficiency ranges from 5–20%, but 10% is a useful average). It means that 1,000 kg of elephant grass supports about 100 kg of herbivore, which supports about 10 kg of carnivore, which supports about 1 kg of top predator. This is why Kaziranga can sustain over 2,400 rhinos and thousands of deer but only about 120 tigers — there simply is not enough energy at the top of the pyramid.\n\nThe 10% rule also explains why food chains rarely exceed 4–5 links. By the fifth trophic level, only 0.01% of the original solar energy remains — not enough to sustain a viable population. It also explains why eating lower on the food chain is more energy-efficient for humans: grain-fed beef requires roughly 10 kg of grain to produce 1 kg of meat, while eating the grain directly captures that energy without the 90% loss.',
    },
    {
      title: 'Keystone Species',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Removing a keystone species has little effect on the rest of the ecosystem.', answer: false, explanation: 'Removing a keystone species causes dramatic shifts in the entire community structure — like removing the keystone from a stone arch.' },
            { text: 'Indian rhinos are keystone species because their grazing creates habitat for smaller animals.', answer: true, explanation: 'Rhino grazing and trampling creates open patches in tall grass, providing habitat for hog deer, reptiles, and raptors.' },
            { text: 'Fig trees are keystone species because they produce fruit year-round.', answer: true, explanation: 'Fig trees sustain hornbills, primates, and bats during seasons when other food is scarce.' },
            { text: 'Top predators like tigers have no effect on plant growth.', answer: false, explanation: 'Tigers regulate herbivore populations, preventing overgrazing — a trophic cascade that affects vegetation.' },
          ],
        },
      },
      beginnerContent: 'A **keystone species** has a disproportionately large effect on its ecosystem relative to its abundance. Remove a keystone species and the entire community structure shifts dramatically — just as removing the keystone from a stone arch causes the whole arch to collapse.\n\nIn Kaziranga, the Indian rhinoceros is a keystone herbivore. Rhinos are "ecosystem engineers" — their heavy grazing and trampling of tall grasses create open patches that allow shorter grasses and herbs to grow. These open areas provide habitat for smaller herbivores like hog deer and Indian hares, basking spots for reptiles, and hunting grounds for raptors. Without rhino grazing, the grasslands would become an impenetrable wall of 6-metre-tall elephant grass, reducing habitat diversity for dozens of species.\n\nOther keystone species in NE India include the fig tree (*Ficus* species), which produces fruit year-round and sustains hornbills, primates, and bats during seasons when other food is scarce. Beavers (in temperate ecosystems) and elephants (in tropical forests) are keystone engineers that physically reshape their habitats. Predators like tigers regulate herbivore populations, preventing overgrazing — a phenomenon called a **trophic cascade**, where effects ripple down through multiple trophic levels. Identifying and protecting keystone species is one of the most efficient conservation strategies because protecting one species indirectly protects many others.',
    },
    {
      title: 'Bioaccumulation and Biomagnification',
      diagram: 'FoodWebDiagram',
      beginnerContent: '**Bioaccumulation** is the gradual buildup of a substance (often a pollutant) in an organism\'s body over its lifetime. Persistent chemicals like mercury, lead, DDT, and certain industrial compounds are not easily metabolized or excreted, so they accumulate in tissues — especially fat — over time. A single fish in a Brahmaputra tributary near a coal mine may absorb tiny amounts of mercury from the water every day, and over years, its mercury concentration becomes far higher than the surrounding water.\n\n**Biomagnification** is the increase in concentration of a substance at each successive trophic level. Small fish accumulate mercury from water and sediment. Larger fish eat many small fish, inheriting and concentrating their mercury loads. A fishing cat or otter that eats many large fish accumulates even higher concentrations. At the top of the food chain, mercury levels can be millions of times higher than in the water itself. This is why top predators — eagles, large fish, humans who eat a lot of fish — are most vulnerable to pollutant poisoning.\n\nDDT biomagnification nearly drove bald eagles and peregrine falcons to extinction in the mid-20th century before the pesticide was banned. In NE India, mercury contamination from coal mining in Meghalaya\'s Jaintia Hills and pesticide runoff from tea plantations enter aquatic food webs and biomagnify through fish to the communities that depend on river fish as a primary protein source. Understanding biomagnification reveals that pollution is not just about concentration in water or soil — it is about how food webs amplify that contamination to dangerous levels in the species (including humans) at the top.',
    },
  ],
};
