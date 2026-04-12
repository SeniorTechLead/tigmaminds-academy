import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'symbiosis-and-interactions',
  title: 'Symbiosis & Species Interactions',
  category: 'ecology',
  icon: '🌿',
  tagline: 'Mutualism, parasitism, and competition — how species shape each other\'s lives.',
  relatedStories: ['wild-orchids-trees', 'pitcher-plant', 'honey-hunters-lesson', 'orchid-colors'],
  understand: [
    {
      title: 'Mutualism — Both Species Benefit',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each mutualism to what each partner gives and gets',
          pairs: [
            ['Fig tree + fig wasp', 'Tree gets pollination; wasp gets a place to lay eggs and food for larvae'],
            ['Plant roots + mycorrhizal fungi', 'Plant gets water and minerals; fungus gets sugars from photosynthesis'],
            ['Rhododendron + sunbird', 'Flower gets pollinated; bird gets nectar as food'],
            ['Legume + Rhizobium bacteria', 'Plant gets nitrogen fixed from air; bacteria get sugars and shelter in root nodules'],
          ],
        },
      },
      beginnerContent: '**Mutualism** is an interaction where both species gain a fitness advantage. Some mutualisms are so tightly evolved that neither partner can survive without the other — these are called **obligate mutualisms**. The fig-wasp mutualism is a textbook example: each of the roughly 750 species of fig tree is pollinated by its own specific species of fig wasp. The wasp enters the fig through a tiny opening (the ostiole), pollinates the flowers inside, lays its eggs, and dies. The wasp larvae develop inside the fig, and emerging adults carry pollen to other figs. Neither the fig nor the wasp can reproduce without the other. Fig trees are keystone species in NE India\'s forests, producing fruit year-round and sustaining hornbills, gibbons, macaques, and fruit bats.\n\n**Mycorrhizae** are mutualistic associations between plant roots and fungi, found in over 90% of plant species. The fungal hyphae extend far beyond the root system, dramatically increasing the plant\'s access to water and minerals (especially phosphorus). In return, the plant provides the fungus with sugars produced through photosynthesis. In NE India\'s forests, mycorrhizal networks connect trees underground — a large tree can share nutrients with seedlings through these fungal connections, a phenomenon sometimes called the "wood wide web." Research has shown that mother trees preferentially channel resources to their own offspring through mycorrhizal networks.\n\nPollination mutualisms are everywhere in NE India. Rhododendrons in the eastern Himalayas are pollinated by sunbirds that drink nectar and transfer pollen between flowers. Bees and butterflies pollinate countless wildflowers. Without these pollinators, the forests could not reproduce — which is why pesticide use that kills pollinators has cascading effects throughout ecosystems.',
      intermediateContent:
        'Mutualism is analysed using **interaction networks** — bipartite graphs linking, for example, plants to their pollinators. These networks show **nestedness** (specialist species interact with subsets of generalists’ partners) and **modularity** (clusters of closely interacting species). Nested networks are robust to random species loss but vulnerable to the extinction of highly connected generalists (like fig trees or large-bodied bee species). The strength of mutualism is measured by **reciprocal fitness benefits**: mycorrhizal associations increase plant phosphorus uptake by 2–10×, while the fungus receives up to 20% of the plant’s photosynthetically fixed carbon. **Cheating** — where one partner takes benefits without reciprocating — is controlled by **partner choice** mechanisms: legumes reduce oxygen supply to root nodules containing less-effective Rhizobium strains, sanctioning cheaters.',
      advancedContent:
        'The evolution of mutualism is modelled by **evolutionary game theory**. The **Prisoner’s Dilemma** framework shows that mutualism is stable when partners interact repeatedly (enabling reciprocity) or when vertical transmission ties partner fitness together. **Phylogenetic analyses** reveal that obligate mutualisms (fig–wasp, yucca–moth) often show **cospeciation** — parallel branching of partner phylogenies, indicating millions of years of co-evolution. However, strict one-to-one cospeciation is rarer than once thought; host-switching events introduce new partners. **Mycorrhizal networks** in forests function as common mycorrhizal networks (CMNs) through which carbon, nitrogen, water, and even defence signals transfer between trees. Isotope labelling experiments (¹³C and ¹⁵N tracers) have quantified carbon transfer from mother trees to seedlings via CMNs, demonstrating that forests are cooperative systems, not merely collections of competing individuals.',
    },
    {
      title: 'Parasitism — One Benefits, One Suffers',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'The Asian koel lays its eggs in crow nests. The koel chick often hatches first and is raised by the unsuspecting crow parents.',
            'Malaria parasites (Plasmodium) have shaped human evolution more than almost any other force, driving genetic adaptations like sickle cell trait.',
            'Dodder (Cuscuta) is a parasitic plant that has completely lost the ability to photosynthesize — it steals water and nutrients by penetrating the vascular tissue of its host.',
          ],
        },
      },
      beginnerContent: '**Parasitism** is an interaction where one organism (the parasite) benefits at the expense of another (the host). Unlike predation, parasitism typically does not kill the host immediately — a dead host is useless to a parasite that needs ongoing nourishment. Parasites include viruses, bacteria, protozoa, fungi, and larger organisms like tapeworms, leeches, and parasitic plants.\n\n**Brood parasitism** is a fascinating behavioral form. The Asian koel (common in NE India) lays its eggs in the nests of crows. The koel chick hatches first, sometimes pushes out the host\'s eggs, and is raised by the unsuspecting crow parents. The cuckoo family is famous for this strategy — over 50 cuckoo species are brood parasites. In an evolutionary arms race, host species develop the ability to recognize and reject foreign eggs, while parasites evolve eggs that increasingly mimic the host\'s in color, size, and pattern.\n\n**Malaria** — caused by *Plasmodium* protozoa transmitted by *Anopheles* mosquitoes — is a parasitic disease that has shaped human evolution more than almost any other force. NE India, with its warm, humid climate and abundant standing water, has historically been a malaria hotspot. The parasite has a complex life cycle, reproducing sexually in the mosquito and asexually in human red blood cells, causing the cyclical fevers characteristic of the disease. Malaria has been so devastating that it has driven the evolution of sickle cell trait in Africa and thalassemia in Southeast Asia — genetic conditions that are harmful in homozygous form but provide malaria resistance in heterozygous carriers.\n\nParasitic plants also exist in NE India. Dodder (*Cuscuta*) wraps around host plants and penetrates their vascular tissue to steal water and nutrients, having lost the ability to photosynthesize entirely.',
    },
    {
      title: 'Competition — The Struggle for Resources',
      diagram: 'PopulationGrowthCurve',
      beginnerContent: '**Interspecific competition** occurs between different species that require the same limited resources — food, water, nesting sites, sunlight, or territory. In NE India\'s forests, trees compete intensely for canopy light. Emergent trees that reach above the canopy monopolize sunlight, while understory species have evolved to photosynthesize efficiently in deep shade. Epiphytic orchids and ferns compete for branch space on host trees. Vultures and crows compete for carrion.\n\nThe **competitive exclusion principle** (Gause\'s principle) states that two species competing for identical resources cannot coexist indefinitely — one will outcompete the other. In practice, species avoid exclusion through **niche partitioning**: dividing resources in ways that reduce direct competition. In the Brahmaputra valley, multiple species of herons fish in the same wetlands but at different depths, times of day, and prey sizes. Great egrets wade in deeper water targeting larger fish, while cattle egrets follow grazing animals to catch disturbed insects on land.\n\n**Intraspecific competition** — competition within a species — is often more intense than interspecific competition because individuals of the same species have identical resource needs. Male rhinos in Kaziranga compete fiercely for mating territories, inflicting serious wounds with their lower incisors. Territorial fights among male tigers can be fatal. In plant communities, intraspecific competition drives "self-thinning" — in a dense stand of seedlings, competition for light and nutrients causes most individuals to die, leaving fewer, larger survivors. A hectare of mature forest may contain 200–400 trees, yet millions of seeds germinated to produce those survivors.',
    },
    {
      title: 'Commensalism — One Benefits, One Is Unaffected',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each interaction type to its definition',
          pairs: [
            ['Mutualism', 'Both species benefit from the interaction'],
            ['Parasitism', 'One species benefits at the expense of the other'],
            ['Competition', 'Both species are harmed by the struggle for shared resources'],
            ['Commensalism', 'One species benefits while the other is unaffected'],
          ],
        },
      },
      beginnerContent: '**Commensalism** is an interaction where one species benefits while the other is neither helped nor harmed. The classic NE India example is **epiphytic orchids growing on trees**. NE India has over 900 species of orchids, many of which grow on tree branches to access canopy light. The orchid benefits from the elevated position and does not extract nutrients from the host tree (unlike parasitic plants), using its aerial roots to absorb moisture and nutrients from rain and debris. The tree is essentially unaffected — the orchid\'s weight is negligible, and it neither helps nor harms its host.\n\nHowever, strict commensalism is rare in nature — most interactions that appear commensal on close examination involve some cost or benefit to the "unaffected" partner. Heavy epiphyte loads can weigh down branches. Epiphytes may intercept rainfall that would otherwise reach the host\'s roots. Conversely, epiphytes may trap moisture and create humid microhabitats that benefit the host. Many ecologists now view commensalism as a point on a spectrum rather than a distinct category.\n\nOther commensal examples from NE India include cattle egrets that follow rhinos and wild buffalo through Kaziranga\'s grasslands, feeding on insects disturbed by the large animals\' movement. The birds benefit from easy meals; the mammals are essentially unaffected. Remora fish attach to sharks for transportation and scraps of food — the shark neither benefits nor is harmed. Hermit crabs use empty snail shells for shelter — the snail is long dead and unaffected. In each case, one organism exploits a resource (movement, shelter, substrate) provided by another without significantly impacting it.',
    },
  ],
};
