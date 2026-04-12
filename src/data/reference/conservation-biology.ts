import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'conservation-biology',
  title: 'Conservation Biology',
  category: 'conservation',
  icon: '🌿',
  tagline: 'Protecting biodiversity — from Kaziranga\'s rhinos to the world\'s disappearing species.',
  relatedStories: ['elephant-corridor', 'girl-grew-forest', 'golden-hilsa', 'red-panda-mask'],
  understand: [
    {
      title: 'Why Biodiversity Matters',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'Pollination by insects and birds is valued at over $200 billion per year globally and enables 75% of food crops.',
            'The Irish Potato Famine killed over a million people because Ireland relied on a single, genetically uniform potato variety susceptible to blight — a devastating example of why genetic diversity matters.',
            'NE India harbours wild relatives of rice, citrus, banana, and tea — genetic reservoirs that breeders may need to develop climate-resistant crops.',
          ],
        },
      },
      beginnerContent: 'Biodiversity — the variety of life at genetic, species, and ecosystem levels — is not just a catalogue of interesting organisms. It underpins **ecosystem services** that human civilization depends on. Pollination by insects and birds (valued at over $200 billion per year globally) enables 75% of food crops. Wetlands filter water, reducing the need for expensive treatment plants. Forests sequester about 2.6 billion tonnes of carbon dioxide per year, slowing climate change. Soil organisms maintain fertility that supports agriculture. Mangroves and coral reefs protect coastlines from storms and erosion.\n\nGenetic diversity within species provides the raw material for adaptation. When environments change — a new disease arrives, temperatures shift, rainfall patterns alter — genetically diverse populations are more likely to contain individuals with traits that allow survival. Monoculture crops, with their narrow genetic base, are vulnerable to devastating epidemics; the Irish Potato Famine of 1845–49 killed over a million people because Ireland relied on a single, genetically uniform potato variety susceptible to blight.\n\nNE India\'s biodiversity is globally significant. The region harbours wild relatives of cultivated rice, citrus, banana, and tea — genetic reservoirs that plant breeders may need to develop disease-resistant or climate-adapted crop varieties. Losing these wild populations forecloses future options. Biodiversity also has intrinsic value independent of human utility — the ethical position that species have a right to exist regardless of their usefulness to us.',
      intermediateContent:
        '**Population viability analysis (PVA)** uses demographic models to estimate a population’s extinction probability over a given timeframe. Inputs include population size, birth and death rates, age structure, carrying capacity, and stochastic variation (environmental and demographic). For the Indian rhinoceros, PVAs show that Kaziranga’s population of ~2,600 has a less than 1% extinction probability over 100 years if current protection levels are maintained, but small satellite populations (< 50 individuals) face much higher risk due to **demographic stochasticity** (random variation in births and deaths) and **inbreeding depression** (reduced fitness from mating between relatives). The **minimum viable population (MVP)** concept estimates the smallest population with a >95% survival probability over 100 years; for large mammals, MVPs typically range from 500 to 5,000 depending on life history.',
      advancedContent:
        '**Conservation genetics** uses molecular tools to manage endangered populations. **Microsatellite** and **SNP** (single nucleotide polymorphism) markers assess genetic diversity, population structure, and gene flow. For one-horned rhinos, genetic studies reveal that Kaziranga, Orang, and Pobitora populations are genetically distinct, and managed translocation between parks maintains diversity. The **effective population size** N_e (the size of an idealised population with the same genetic drift rate) is often far smaller than the census population N due to unequal sex ratios, variance in reproductive success, and population fluctuations; for Kaziranga rhinos, N_e/N ≈ 0.1–0.3. **Environmental DNA (eDNA)** — DNA shed by organisms into water or soil — enables non-invasive biodiversity surveys: a single water sample from a Brahmaputra tributary can detect the presence of the Gangetic river dolphin, golden mahseer, and dozens of fish species simultaneously via metabarcoding.',
    },
    {
      title: 'Threats to Biodiversity',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each threat to its NE India example',
          pairs: [
            ['Habitat loss', 'Forest conversion to tea plantations and rubber estates; shortened jhum fallow cycles'],
            ['Overexploitation', 'Hunting of hoolock gibbons and pangolins; overfishing of golden hilsa'],
            ['Pollution', 'Acid mine drainage from Meghalaya coal mines; pesticide runoff from tea gardens'],
            ['Invasive species', 'Water hyacinth choking wetlands across Assam'],
            ['Climate change', 'Shifting species ranges uphill; melting Himalayan glaciers; altered monsoons'],
          ],
        },
      },
      beginnerContent: 'The five major drivers of biodiversity loss, in order of impact, are: **habitat loss and degradation**, **overexploitation**, **pollution**, **invasive species**, and **climate change**. In NE India, all five operate simultaneously.\n\n**Habitat loss** is the greatest threat. Shifting cultivation with shortened fallow cycles, conversion of forests to tea plantations and rubber estates, dam construction, road building, and urban expansion have reduced and fragmented NE India\'s forests. Between 2001 and 2020, NE India lost approximately 3,200 square kilometres of tree cover. Fragmentation isolates populations, preventing genetic exchange and making small populations vulnerable to local extinction.\n\n**Overexploitation** includes hunting for bushmeat, traditional medicine, and the wildlife trade. NE India\'s tribal communities have long hunting traditions, and while subsistence hunting was historically sustainable, modern weapons and market demand have intensified pressure. The hoolock gibbon, clouded leopard, and pangolin are all threatened by hunting in the region. Overfishing of the golden hilsa in the Brahmaputra has depleted stocks.\n\n**Pollution** from coal mining (acid mine drainage in Meghalaya), pesticide runoff from tea gardens, and industrial effluents degrades aquatic habitats. **Invasive species** like water hyacinth (*Eichhornia crassipes*) choke wetlands across Assam. **Climate change** is shifting species\' ranges uphill, reducing habitat for alpine species with nowhere higher to go, and altering monsoon patterns that ecosystems have adapted to over millennia.',
    },
    {
      title: 'IUCN Red List Categories',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each IUCN category to its NE India species',
          pairs: [
            ['Critically Endangered (CR)', 'Pygmy hog — fewer than 250 individuals, found only in Assam grasslands'],
            ['Endangered (EN)', 'Indian one-horned rhinoceros — about 4,000 individuals'],
            ['Endangered (EN)', 'Bengal tiger, red panda, hoolock gibbon, golden langur'],
            ['Vulnerable (VU)', 'Indian elephant — 20,000-25,000 individuals, declining'],
          ],
        },
      },
      beginnerContent: 'The International Union for Conservation of Nature (IUCN) maintains the **Red List of Threatened Species** — the most comprehensive global inventory of species\' conservation status. Species are assessed and placed into categories based on quantitative criteria including population size, rate of decline, geographic range, and population fragmentation.\n\nThe categories, from least to most threatened, are: **Least Concern (LC)** — widespread and abundant (e.g., house sparrow, though even this species is declining in cities); **Near Threatened (NT)** — likely to qualify as threatened in the near future; **Vulnerable (VU)** — facing a high risk of extinction in the wild (e.g., the Indian elephant, with a declining population of 20,000–25,000); **Endangered (EN)** — facing a very high risk of extinction (e.g., the Indian one-horned rhinoceros, with about 4,000 individuals); **Critically Endangered (CR)** — facing an extremely high risk of extinction (e.g., the pygmy hog, with fewer than 250 mature individuals, found only in Assam\'s grasslands); **Extinct in the Wild (EW)** — surviving only in captivity; and **Extinct (EX)** — no individuals surviving anywhere.\n\nAs of 2024, the IUCN has assessed over 157,000 species, of which more than 44,000 are threatened with extinction. NE India is home to numerous Red-Listed species: the Bengal tiger (EN), red panda (EN), hoolock gibbon (EN), golden langur (EN), white-winged duck (EN), and the gharial (CR). The Red List is not just a catalogue of doom — it is a tool that guides conservation priorities, funding allocation, and policy decisions. A species\' Red List status can trigger legal protections, habitat conservation programs, and international trade restrictions.',
    },
    {
      title: 'Protected Areas',
      diagram: 'NEIndiaBiomesDiagram',
      beginnerContent: 'Protected areas are geographically defined spaces managed for the long-term conservation of nature and ecosystem services. India\'s protected area network includes **national parks** (strict protection, no human settlement or resource extraction allowed), **wildlife sanctuaries** (some regulated human activities permitted), **conservation reserves**, and **community reserves**. India has 106 national parks, 567 wildlife sanctuaries, and 99 conservation reserves, covering about 5.3% of the country\'s land area.\n\n**Biosphere reserves** are a broader concept — large areas that include a core zone of strict protection, a buffer zone with limited human activity, and a transition zone where sustainable development is practiced. India has 18 biosphere reserves, including the Nokrek Biosphere Reserve in Meghalaya (protecting wild citrus species and the hoolock gibbon) and the Manas Biosphere Reserve in Assam.\n\nNE India has an impressive protected area network: Kaziranga National Park (UNESCO World Heritage Site, home to two-thirds of the world\'s Indian rhinos), Manas National Park (another UNESCO site, with tigers, elephants, golden langurs, and pygmy hogs), Namdapha National Park in Arunachal Pradesh (one of the largest protected areas in eastern India, spanning 1,985 sq km across tropical to alpine habitats), and Keibul Lamjao National Park in Manipur (the world\'s only floating national park, protecting the sangai deer). However, protected areas alone are not sufficient — animals do not respect park boundaries, and isolated parks without connecting corridors become ecological islands where populations dwindle over time.',
    },
    {
      title: 'Conservation Success Stories in NE India',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'The Indian one-horned rhino population recovered from fewer than 200 in the early 1900s to over 4,000 today — one of Asia\'s greatest conservation achievements.',
            'Manas National Park lost its UNESCO World Heritage status in 1992 due to poaching but regained it in 2011 after local Bodo communities shifted from poaching to conservation.',
            'Jadav Payeng planted trees every day for over 40 years on a barren sandbar, creating a 550-hectare forest (larger than Central Park) now home to elephants, tigers, and rhinos.',
          ],
        },
      },
      beginnerContent: 'Despite the challenges, NE India has produced remarkable conservation successes. The **Indian one-horned rhinoceros** was hunted to near extinction in the early 20th century, with fewer than 200 individuals remaining by the 1900s. Strict protection in Kaziranga (established as a reserve forest in 1905, largely at the urging of Mary Curzon, Vicereine of India) and other parks, combined with anti-poaching patrols, translocation programs, and habitat management, has brought the global population to over 4,000 today. Kaziranga alone holds about 2,600 rhinos — one of the great conservation achievements in Asia.\n\nThe **Manas tiger rebound** is another success. Manas National Park in Assam lost its World Heritage status in 1992 due to political unrest and poaching that devastated its wildlife. By the early 2000s, tiger numbers had plummeted. Sustained efforts by park authorities, the Indian army, and local Bodo communities — who transitioned from poaching to conservation and eco-tourism — helped tiger numbers recover from fewer than 10 to over 40 by the 2020s. Manas regained its World Heritage status in 2011.\n\n**Jadav Payeng\'s forest** is perhaps the most inspiring individual conservation story. Starting in 1979 as a teenager, Jadav Payeng planted trees on a barren sandbar (Majuli Island area) in the Brahmaputra. Over 40 years of daily planting, he created the Molai forest — spanning over 550 hectares (larger than Central Park), now home to elephants, Bengal tigers, Indian rhinoceroses, deer, rabbits, and over 100 bird species. From one boy with a handful of saplings to a thriving forest ecosystem — proof that individual action, sustained over time, can transform landscapes.',
    },
  ],
};
