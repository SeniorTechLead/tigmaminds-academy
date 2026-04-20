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
      diagram: 'OrchidSymbiosisSpectrumDiagram',
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
      beginnerContent:
        '**Think of your best friendship.**\n\n' +
        'You help your friend with maths homework; they share their lunch when you forget yours. ' +
        'Both of you are better off because of the relationship. Nature is full of partnerships ' +
        'exactly like this — biologists call them **mutualism**.\n\n' +
        '**What is mutualism?**\n\n' +
        'Mutualism is an interaction where **both species gain a fitness advantage** — they survive ' +
        'or reproduce better together than apart. Some mutualisms are so tightly woven that neither ' +
        'partner can survive alone. These are called **obligate mutualisms**.\n\n' +
        '**The fig and its wasp — a marriage millions of years old**\n\n' +
        'Each of the roughly 750 species of fig tree is pollinated by its own specific species of fig wasp. ' +
        'The wasp enters the fig through a tiny opening called the ostiole, pollinates the internal flowers, ' +
        'lays her eggs, and dies inside. Her larvae develop within the fig, and emerging adults carry pollen ' +
        'to the next fig. Neither partner can reproduce without the other.\n\n' +
        'Fig trees are **keystone species** in tropical forests — they produce fruit year-round when other ' +
        'trees are bare, sustaining hornbills, gibbons, macaques, and fruit bats through lean months.\n\n' +
        '| Mutualism | What Partner A Gives | What Partner B Gives | Type |\n' +
        '|---|---|---|---|\n' +
        '| Fig tree + fig wasp | Shelter, egg-laying site | Pollination | Obligate |\n' +
        '| Mycorrhizal fungi + plant roots | Water, phosphorus (2-10x more) | Sugars (up to 20% of photosynthate) | Facultative to obligate |\n' +
        '| Rhododendron + sunbird | Nectar | Pollen transfer between flowers | Facultative |\n' +
        '| Legume + *Rhizobium* bacteria | Sugars, root-nodule shelter | Atmospheric nitrogen fixed into usable form | Facultative |\n' +
        '| Acacia + ant | Hollow thorns for nesting, nectar | Defence — ants attack herbivores | Obligate |\n\n' +
        '**The underground internet: mycorrhizal networks**\n\n' +
        'Over 90% of land plants have fungi growing on or inside their roots — a partnership called ' +
        '**mycorrhizae** (literally "fungus-roots"). The fungal hyphae are incredibly thin threads ' +
        'that extend far beyond the root system, dramatically increasing the plant\'s access to water ' +
        'and minerals, especially phosphorus.\n\n' +
        'In return, the plant feeds the fungus with sugars from photosynthesis. But here is the remarkable ' +
        'part: these fungal threads connect tree to tree, creating underground networks through which ' +
        'carbon, water, and even chemical defence signals can flow. Scientists sometimes call this the ' +
        '"wood wide web." Research has shown that large mother trees channel resources to their own ' +
        'seedlings through these networks — the forest is a cooperative community, not just a collection ' +
        'of competing individuals.\n\n' +
        '**Analogy: Mutualism is like a business partnership**\n\n' +
        'A baker and a dairy farmer trade bread for milk. Both end up with breakfast they couldn\'t ' +
        'make alone. If the baker\'s oven breaks, the farmer also goes hungry — that\'s the vulnerability ' +
        'of obligate mutualism. If either partner disappears, the other may collapse too.\n\n' +
        '**Pollination mutualisms**\n\n' +
        'Eastern Himalayan rhododendrons are pollinated by sunbirds that drink nectar and inadvertently ' +
        'transfer pollen between flowers. Bees and butterflies pollinate countless wildflowers in meadows ' +
        'and forest clearings. Without these pollinators, forests could not reproduce — which is why ' +
        'pesticide use that kills pollinators has cascading effects throughout entire ecosystems.\n\n' +
        '| Pollinator | Plants Served | Key Trait |\n' +
        '|---|---|---|\n' +
        '| Honeybee (*Apis cerana*) | Mustard, citrus, wild berries | Hairy body traps pollen |\n' +
        '| Sunbird | Rhododendron, banana flower | Long curved beak reaches deep nectar |\n' +
        '| Fig wasp | Figs (one wasp species per fig species) | Tiny body fits through the ostiole |\n' +
        '| Hawk moth | Night-blooming orchids | Long proboscis, nocturnal flight |\n' +
        '| Fruit bat | Wild banana, durian | Large body carries pollen over kilometres |\n\n' +
        '**Check yourself:** If all fig wasps went extinct tomorrow, which other animals would be ' +
        'affected and why? (Hint: think about what eats fig fruit.)',
      intermediateContent:
        '**Interaction networks — mapping who depends on whom**\n\n' +
        'Ecologists study mutualism using **bipartite interaction networks** — graphs with two sets of ' +
        'nodes (e.g., plants on one side, pollinators on the other) connected by edges representing ' +
        'interactions. Two key structural properties emerge:\n\n' +
        '| Network Property | Definition | Ecological Consequence |\n' +
        '|---|---|---|\n' +
        '| **Nestedness** | Specialist species interact with subsets of generalists\' partners | Robust to random species loss; vulnerable to loss of highly connected generalists |\n' +
        '| **Modularity** | Clusters of tightly interacting species | Disturbances affect modules, not the whole network |\n' +
        '| **Connectance** | Proportion of possible links that are realized | Higher connectance = more redundancy |\n' +
        '| **Asymmetry** | Specialist depends on generalist more than vice versa | Generalists are keystone partners |\n\n' +
        'A nested pollination network means that if you lose a rare specialist bee, the plants it ' +
        'visited are still pollinated by generalist bees. But if you lose a highly connected generalist ' +
        '(like *Apis cerana*), dozens of plant species lose their primary pollinator simultaneously.\n\n' +
        '**Measuring mutualism strength**\n\n' +
        'The benefit of mutualism is quantified by **reciprocal fitness effects**:\n\n' +
        '- Mycorrhizal fungi increase plant phosphorus uptake by **2-10x**\n' +
        '- The fungus receives up to **20% of the plant\'s photosynthetically fixed carbon**\n' +
        '- *Rhizobium* fixes **100-300 kg of nitrogen per hectare per year** for legumes\n' +
        '- Cleaner fish remove **1,200+ parasites per day** from client reef fish\n\n' +
        '**The cheating problem**\n\n' +
        'If mutualism benefits both partners, why doesn\'t one partner cheat — taking benefits without ' +
        'giving back? Cheating does occur, and partners have evolved **sanctions** to control it:\n\n' +
        '| System | Cheating Behaviour | Sanction Mechanism |\n' +
        '|---|---|---|\n' +
        '| Legume + *Rhizobium* | Some bacterial strains fix less nitrogen | Plant cuts oxygen supply to low-performing nodules |\n' +
        '| Fig + fig wasp | Some wasps lay eggs without pollinating | Fig aborts unpollinated figs, killing wasp larvae |\n' +
        '| Yucca + yucca moth | Moth lays too many eggs, consuming too many seeds | Plant aborts fruits with too many moth eggs |\n' +
        '| Cleaner fish + client | Cleaner eats client mucus instead of parasites | Client jolts body or avoids that cleaner in future |\n\n' +
        'These sanctions maintain honesty in the partnership — natural selection favours individuals ' +
        'that can detect and punish cheaters.',
      advancedContent:
        '**Evolutionary game theory of mutualism**\n\n' +
        'The evolution of mutualism is modelled using the **Prisoner\'s Dilemma** framework. ' +
        'In a single interaction, cheating always pays more than cooperating. But mutualism becomes ' +
        'stable when:\n\n' +
        '| Stabilising Mechanism | How It Works | Example |\n' +
        '|---|---|---|\n' +
        '| Repeated interactions | Partners interact many times; cheaters are punished | Cleaner fish visit the same reef clients daily |\n' +
        '| Vertical transmission | Offspring inherit the parent\'s partner | Aphids pass *Buchnera* bacteria to offspring in eggs |\n' +
        '| Partner choice | Hosts select the best-performing partners | Legumes sanction low-nitrogen-fixing *Rhizobium* |\n' +
        '| Spatial structure | Cooperators cluster, excluding cheaters | Mycorrhizal networks link cooperating trees |\n' +
        '| By-product benefit | Cooperation costs nothing extra | Seed-dispersing birds benefit from eating fruit |\n\n' +
        '**Cospeciation and phylogenetic congruence**\n\n' +
        'Obligate mutualisms (fig-wasp, yucca-moth) often show **cospeciation** — parallel branching ' +
        'in partner phylogenies, indicating millions of years of co-evolution. When fig species A splits ' +
        'into species A1 and A2, its wasp partner often splits in parallel. However, strict one-to-one ' +
        'cospeciation is rarer than once thought. **Host-switching** events introduce new partners, and ' +
        'molecular clock analyses reveal that some fig-wasp associations are younger than the fig species ' +
        'themselves — evidence of partner replacement.\n\n' +
        '**Common mycorrhizal networks (CMNs) — quantified**\n\n' +
        'Isotope-labelling experiments using ^13C and ^15N tracers have revealed that:\n\n' +
        '- Carbon transfers from **mother trees to conspecific seedlings** at rates 2-4x higher than to ' +
        'non-kin seedlings\n' +
        '- Stressed trees receive **more carbon** from healthy neighbours via CMNs\n' +
        '- Defence signalling molecules (methyl jasmonate) travel through CMNs, allowing a tree attacked ' +
        'by herbivores to "warn" its neighbours, which then upregulate their own defences\n\n' +
        'These findings reframe forests as **cooperative superorganisms** rather than battlegrounds of ' +
        'selfish individuals — a paradigm shift in forest ecology with direct implications for ' +
        'silviculture and conservation.',
    },
    {
      title: 'Parasitism — One Benefits, One Suffers',
      diagram: 'PitcherNutrientDiagram',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'The Asian koel lays its eggs in crow nests. The koel chick often hatches first and is raised by unsuspecting crow parents — a strategy called brood parasitism.',
            'Malaria parasites (Plasmodium) have shaped human evolution more than almost any other force, driving genetic adaptations like sickle cell trait and thalassemia.',
            'Dodder (Cuscuta) is a parasitic plant that has completely lost the ability to photosynthesize — it steals water and nutrients by penetrating the vascular tissue of its host.',
            'Some parasites manipulate their host\'s behaviour: *Ophiocordyceps* fungus turns ants into "zombies" that climb to ideal spore-dispersal height before dying.',
          ],
        },
      },
      beginnerContent:
        '**Imagine a house guest who eats your food, sleeps in your bed, and never pays rent.**\n\n' +
        'That is parasitism — one organism (the **parasite**) benefits at the expense of another ' +
        '(the **host**). Unlike a predator that kills and moves on, a parasite typically keeps its ' +
        'host alive as long as possible. A dead host means no more free meals.\n\n' +
        '**Types of parasites**\n\n' +
        '| Type | Where They Live | Examples |\n' +
        '|---|---|---|\n' +
        '| **Ectoparasites** | On the host\'s surface | Leeches, ticks, lice, mosquitoes |\n' +
        '| **Endoparasites** | Inside the host\'s body | Tapeworms, liver flukes, *Plasmodium* |\n' +
        '| **Brood parasites** | In the host\'s nest | Asian koel, cuckoos |\n' +
        '| **Parasitic plants** | Attached to host plant\'s vascular tissue | Dodder (*Cuscuta*), mistletoe |\n' +
        '| **Parasitoids** | Inside the host; eventually kill it | Parasitoid wasps (lay eggs in caterpillars) |\n\n' +
        '**Brood parasitism — the con artist of the bird world**\n\n' +
        'The Asian koel, a common bird across South and Southeast Asia, never builds its own nest. ' +
        'Instead, the female lays her eggs in the nests of crows. The koel egg mimics the host\'s eggs ' +
        'in size and colour. The koel chick often hatches first, sometimes pushes out the host\'s eggs, ' +
        'and is raised by the unsuspecting crow parents who work tirelessly to feed a chick that isn\'t ' +
        'theirs.\n\n' +
        'Over 50 cuckoo species worldwide use this strategy. It triggers an **evolutionary arms race**: ' +
        'host birds evolve the ability to recognise and reject foreign eggs, while parasites evolve eggs ' +
        'that increasingly mimic the host\'s in colour, size, and pattern. Some cuckoo eggs are so ' +
        'perfectly matched that even trained ornithologists struggle to tell them apart.\n\n' +
        '| Arms Race Stage | Host Adaptation | Parasite Counter-Adaptation |\n' +
        '|---|---|---|\n' +
        '| Egg recognition | Host learns to spot foreign eggs by colour/pattern | Parasite evolves near-perfect egg mimicry |\n' +
        '| Egg rejection | Host pushes out suspicious eggs | Parasite lays eggs that are thicker-shelled, harder to eject |\n' +
        '| Chick recognition | Some hosts recognise alien chicks | Parasite chick mimics host chick\'s begging calls |\n' +
        '| Nest abandonment | Host abandons parasitised nest entirely | Parasite targets nests at the optimal moment |\n\n' +
        '**Malaria — the parasite that shaped human evolution**\n\n' +
        '*Plasmodium* protozoa, transmitted by *Anopheles* mosquitoes, cause malaria — a disease that ' +
        'has killed more humans than any other infectious agent in history. The parasite has a ' +
        'fiendishly complex life cycle: it reproduces sexually inside the mosquito and asexually ' +
        'inside human red blood cells, causing the cyclical fevers characteristic of the disease.\n\n' +
        'Warm, humid regions with standing water provide ideal mosquito breeding habitat. Malaria has ' +
        'been so devastating over millennia that it has driven the evolution of genetic defences in human ' +
        'populations: sickle cell trait in Africa and thalassemia in Southeast Asia are harmful in ' +
        'homozygous form but provide malaria resistance in heterozygous carriers.\n\n' +
        '**Parasitic plants**\n\n' +
        'Dodder (*Cuscuta*) is a rootless, leafless vine that wraps around host plants and penetrates ' +
        'their vascular tissue with structures called **haustoria**. Having lost the ability to ' +
        'photosynthesize entirely, dodder is completely dependent on its host for water, minerals, and ' +
        'sugars. Mistletoe is a partial parasite (hemiparasite) — it photosynthesizes but taps into the ' +
        'host tree\'s water supply.\n\n' +
        '**Check yourself:** Why would a parasite evolve to be *less* harmful over time? ' +
        '(Hint: what happens to the parasite if it kills its host too quickly?)',
      intermediateContent:
        '**Parasite-host coevolution — the Red Queen hypothesis**\n\n' +
        'The **Red Queen hypothesis** (Van Valen, 1973) proposes that species must constantly evolve ' +
        'just to maintain their current fitness — like the Red Queen in *Alice Through the Looking Glass*, ' +
        'who runs as fast as she can just to stay in place. Parasites and hosts are locked in an endless ' +
        'evolutionary arms race:\n\n' +
        '- Hosts evolve **immune defences** (antibodies, inflammatory responses, behavioural avoidance)\n' +
        '- Parasites evolve **evasion strategies** (antigenic variation, immune suppression, molecular mimicry)\n' +
        '- Neither side "wins" permanently — the race continues indefinitely\n\n' +
        'This arms race drives some of the fastest evolutionary change observed in nature. *Plasmodium* ' +
        'changes its surface proteins every few cell divisions (**antigenic variation**), staying one step ' +
        'ahead of the host\'s immune system.\n\n' +
        '**Virulence evolution — the trade-off model**\n\n' +
        '| Strategy | Virulence | Transmission | Host Survival | Example |\n' +
        '|---|---|---|---|---|\n' +
        '| Mild parasite | Low | Needs mobile host to spread | Long | Common cold viruses |\n' +
        '| Lethal parasite | High | Must spread quickly before host dies | Short | Ebola |\n' +
        '| Vector-transmitted | Can be high | Mosquito carries it; host mobility irrelevant | Variable | Malaria |\n' +
        '| Vertically transmitted | Very low | Passes to offspring; needs healthy parent | Long | *Wolbachia* in insects |\n\n' +
        'The key insight: **virulence is shaped by transmission mode**. If the parasite needs the host ' +
        'to walk around and sneeze on others (airborne transmission), killing the host too quickly ' +
        'reduces transmission — selection favours milder strains. But if a mosquito carries the parasite ' +
        'from a bedridden host, high virulence carries no transmission penalty.\n\n' +
        '**Parasite manipulation of host behaviour**\n\n' +
        '| Parasite | Host | Behavioural Change | Benefit to Parasite |\n' +
        '|---|---|---|---|\n' +
        '| *Ophiocordyceps* fungus | Carpenter ant | Ant climbs to ideal height, clamps onto leaf, dies | Spores released from elevated position for wider dispersal |\n' +
        '| *Toxoplasma gondii* | Rat | Rat loses fear of cats | Parasite needs to reach cat gut to reproduce sexually |\n' +
        '| *Leucochloridium* fluke | Snail | Tentacles swell and pulsate, mimicking caterpillars | Bird eats snail, completing parasite life cycle |\n' +
        '| Hairworm (*Spinochordodes*) | Cricket | Cricket jumps into water (suicidal) | Adult worm needs water to reproduce |',
      advancedContent:
        '**Quantitative parasitology — modelling disease dynamics**\n\n' +
        'The **basic reproduction number** R₀ (pronounced "R-nought") is the expected number of new ' +
        'infections produced by a single infected individual in a fully susceptible population. If ' +
        'R₀ > 1, the disease spreads; if R₀ < 1, it dies out.\n\n' +
        '| Disease | R₀ | Transmission Route |\n' +
        '|---|---|---|\n' +
        '| Measles | 12-18 | Airborne |\n' +
        '| Malaria | 5-100+ (varies by region) | Mosquito vector |\n' +
        '| Influenza | 2-3 | Droplet |\n' +
        '| Ebola | 1.5-2.5 | Bodily fluid contact |\n' +
        '| COVID-19 (original) | 2-3 | Airborne/droplet |\n\n' +
        'For malaria, R₀ depends on mosquito density, bite rate, parasite development time in the ' +
        'mosquito, and human recovery rate. The **Ross-Macdonald model** captures this:\n\n' +
        'R₀ = (m × a² × b × c × p^n) / (r × -ln(p))\n\n' +
        'where m = mosquito density per human, a = biting rate, b = probability mosquito infects human, ' +
        'c = probability human infects mosquito, p = daily mosquito survival probability, n = parasite ' +
        'incubation period in mosquito (days), r = human recovery rate.\n\n' +
        '**Parasite-mediated sexual selection**\n\n' +
        'The **Hamilton-Zuk hypothesis** proposes that elaborate male ornaments (bright plumage, long tails) ' +
        'are honest signals of parasite resistance. Only males with strong immune systems can afford to ' +
        'maintain bright colours while fighting off parasites. Females choosing the brightest males ' +
        'gain "good genes" for their offspring. Supporting evidence:\n\n' +
        '- Bird species with higher parasite loads show **more elaborate male plumage**\n' +
        '- Experimental removal of parasites makes males brighter, confirming the causal link\n' +
        '- MHC (major histocompatibility complex) diversity correlates with mate attractiveness in many vertebrates\n\n' +
        '**Coevolutionary hotspots**\n\n' +
        'The **geographic mosaic theory of coevolution** (Thompson, 2005) argues that coevolution ' +
        'doesn\'t happen uniformly across a species\' range. Instead, there are **hotspots** ' +
        '(intense reciprocal selection) and **coldspots** (one-sided or weak selection). Gene flow ' +
        'between hotspots and coldspots creates a shifting geographic mosaic of local adaptation, ' +
        'explaining why a parasite may be highly virulent in one population and mild in another.',
    },
    {
      title: 'Competition — The Struggle for Resources',
      diagram: 'PopulationGrowthCurve',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each competition type to a real example',
          pairs: [
            ['Interspecific — exploitative', 'Multiple heron species competing for fish in the same wetland'],
            ['Interspecific — interference', 'A territorial bird chasing other species away from a fruiting tree'],
            ['Intraspecific — territorial', 'Male rhinos fighting for mating territories with their lower incisors'],
            ['Intraspecific — scramble', 'Seedlings in a dense stand competing for light until most die (self-thinning)'],
          ],
        },
      },
      beginnerContent:
        '**Imagine 30 students and only 10 chairs in the classroom.**\n\n' +
        'Someone is going to be left standing. That struggle for a limited resource — whether it\'s ' +
        'chairs, food, sunlight, water, or nesting sites — is **competition**. In nature, competition ' +
        'is one of the most powerful forces shaping which species survive and where.\n\n' +
        '**Two kinds of competition**\n\n' +
        '| Type | Between Whom | Example | Intensity |\n' +
        '|---|---|---|---|\n' +
        '| **Interspecific** | Different species | Herons and egrets fishing in the same wetland | Moderate — species differ somewhat in needs |\n' +
        '| **Intraspecific** | Same species | Tiger vs tiger for territory | Intense — identical resource needs |\n\n' +
        'Intraspecific competition is almost always fiercer because individuals of the same species ' +
        'need exactly the same food, shelter, and mates. Two tigers need the same size territory, ' +
        'the same prey species, and the same kind of den.\n\n' +
        '**The competitive exclusion principle**\n\n' +
        'In 1934, Russian ecologist G.F. Gause grew two species of *Paramecium* in the same test tube ' +
        'with identical food. Every time, one species outcompeted the other to extinction. His conclusion, ' +
        'now called **Gause\'s principle**: two species competing for identical resources cannot coexist ' +
        'indefinitely — one will always win.\n\n' +
        'But wait — in nature, we see hundreds of species living side by side. How?\n\n' +
        '**Niche partitioning — dividing the pie**\n\n' +
        'Species avoid competitive exclusion by dividing resources in ways that reduce direct overlap. ' +
        'In the Brahmaputra valley, multiple heron species fish in the same wetlands but partition ' +
        'the resource beautifully:\n\n' +
        '| Species | Water Depth | Prey Type | Time of Day |\n' +
        '|---|---|---|---|\n' +
        '| Great egret | Deep water (30-50 cm) | Large fish, frogs | Morning and evening |\n' +
        '| Little egret | Shallow water (10-20 cm) | Small fish, shrimp | Daytime |\n' +
        '| Cattle egret | On land, near grazing animals | Insects disturbed by hooves | Daytime |\n' +
        '| Pond heron | Muddy edges (5-15 cm) | Crabs, insects, tadpoles | Dawn and dusk |\n' +
        '| Night heron | Moderate depth (15-30 cm) | Fish, frogs | Nocturnal |\n\n' +
        'Same wetland, same general food type — but each species has carved out its own niche ' +
        'by specialising in different depths, prey sizes, and active hours.\n\n' +
        '**Competition in forests — the race for light**\n\n' +
        'In tropical forests, trees compete intensely for canopy sunlight. Emergent trees that ' +
        'reach above the canopy monopolize light, while understorey species have evolved to ' +
        'photosynthesize efficiently in deep shade. Epiphytic orchids and ferns compete for branch ' +
        'space on host trees. A single hectare of mature forest may contain 200-400 trees, yet ' +
        'millions of seeds germinated to produce those survivors — a brutal process of ' +
        '**self-thinning** driven by intraspecific competition.\n\n' +
        '**Analogy: Competition is like the job market**\n\n' +
        'A city with one bakery thrives. Open a second bakery next door (interspecific competition), ' +
        'and both struggle — unless one specialises in bread and the other in pastries (niche partitioning). ' +
        'Within each bakery, employees compete for promotions (intraspecific competition).\n\n' +
        '**Check yourself:** Kaziranga has both wild buffalo (*Bubalus arnee*) and domestic buffalo. ' +
        'They eat the same grasses and use the same water holes. Predict what happens when domestic ' +
        'buffalo numbers increase dramatically.',
      intermediateContent:
        '**Lotka-Volterra competition equations**\n\n' +
        'The mathematical foundation of competition theory was laid by Alfred Lotka (1925) and ' +
        'Vito Volterra (1926). For two competing species:\n\n' +
        'dN₁/dt = r₁N₁(K₁ - N₁ - α₁₂N₂) / K₁\n\n' +
        'dN₂/dt = r₂N₂(K₂ - N₂ - α₂₁N₁) / K₂\n\n' +
        'Where:\n' +
        '- N₁, N₂ = population sizes\n' +
        '- r₁, r₂ = intrinsic growth rates\n' +
        '- K₁, K₂ = carrying capacities\n' +
        '- α₁₂ = competitive effect of species 2 on species 1\n' +
        '- α₂₁ = competitive effect of species 1 on species 2\n\n' +
        '**Coexistence outcomes:**\n\n' +
        '| Condition | Outcome | Biological Meaning |\n' +
        '|---|---|---|\n' +
        '| K₁/α₁₂ > K₂ **and** K₂/α₂₁ > K₁ | **Stable coexistence** | Each species limits itself more than it limits the other |\n' +
        '| K₁/α₁₂ < K₂ **and** K₂/α₂₁ < K₁ | **Unstable — one wins** (depends on starting numbers) | Each species limits the other more than itself |\n' +
        '| K₁/α₁₂ > K₂ **and** K₂/α₂₁ < K₁ | **Species 1 always wins** | Species 1 is the superior competitor |\n' +
        '| K₁/α₁₂ < K₂ **and** K₂/α₂₁ > K₁ | **Species 2 always wins** | Species 2 is the superior competitor |\n\n' +
        'The crucial insight: **coexistence requires that intraspecific competition exceeds ' +
        'interspecific competition** for both species. In ecological terms, each species must limit ' +
        'itself more than it limits the other.\n\n' +
        '**Character displacement**\n\n' +
        'When two similar species occur in the same habitat, competition drives them to diverge in ' +
        'traits related to resource use — a process called **character displacement**. The classic ' +
        'example involves Darwin\'s finches on the Galapagos: on islands where two species coexist, ' +
        'their beak sizes diverge (one gets larger, one smaller); on islands where only one species ' +
        'exists, beak size is intermediate.\n\n' +
        '| Scenario | Beak Size of Species A | Beak Size of Species B |\n' +
        '|---|---|---|\n' +
        '| Alone on island | Medium (10 mm) | Medium (10 mm) |\n' +
        '| Together on same island | Small (8 mm) | Large (12 mm) |\n\n' +
        'This divergence reduces competition by allowing each species to exploit different seed sizes.',
      advancedContent:
        '**Modern coexistence theory**\n\n' +
        'Classical Lotka-Volterra models tell us *whether* species coexist, but **modern coexistence ' +
        'theory** (Chesson, 2000) explains *how*. Two mechanisms maintain diversity:\n\n' +
        '| Mechanism | Type | How It Works | Example |\n' +
        '|---|---|---|---|\n' +
        '| **Stabilising** | Niche difference | Species use different resources or respond differently to environment | Herons fishing at different depths |\n' +
        '| **Equalising** | Fitness similarity | Species have similar per-capita growth rates when rare | Co-occurring grass species with similar growth rates |\n\n' +
        'Coexistence requires that **stabilising niche differences exceed fitness differences**. If ' +
        'two species are ecologically identical (no stabilising mechanism), even tiny fitness differences ' +
        'lead to competitive exclusion — confirming Gause\'s principle from a different angle.\n\n' +
        '**The storage effect and temporal niche partitioning**\n\n' +
        'In variable environments, species coexist via the **storage effect** (Chesson & Warner, 1981). ' +
        'Each species reproduces best in different years (e.g., one species thrives in wet years, another ' +
        'in dry years). Long-lived adults "store" good years\' reproduction, buffering against bad years. ' +
        'This explains the extraordinary diversity of desert annual plants, tropical trees, and coral ' +
        'reef fish — all environments with high temporal variability.\n\n' +
        '**Apparent competition**\n\n' +
        'Two species that share a predator can suppress each other even without competing for resources ' +
        'directly — a phenomenon called **apparent competition** (Holt, 1977). When species A increases, ' +
        'the shared predator population grows, which then suppresses species B. Apparent competition ' +
        'is difficult to distinguish from resource competition in the field but can be detected through ' +
        'removal experiments.\n\n' +
        '**Worked example — detecting competition**\n\n' +
        'A researcher studying two reed-warbler species in Assam\'s wetlands measures territory sizes:\n\n' +
        '- Species A alone: 0.3 hectare territories\n' +
        '- Species B alone: 0.25 hectare territories\n' +
        '- Both present: A expands to 0.5 ha, B shrinks to 0.15 ha\n\n' +
        'Larger territories when the competitor is present indicate **interference competition** — ' +
        'species A is behaviourally dominant, forcing species B into smaller, lower-quality territories. ' +
        'Species B persists because it can exploit marginal habitats that species A avoids ' +
        '(stabilising niche difference).',
    },
    {
      title: 'Commensalism & Amensalism — The Unequal Partnerships',
      diagram: 'ElephantEcosystemDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Classify each interaction: mutualism, parasitism, commensalism, or amensalism',
          pairs: [
            ['Orchid growing on a tree branch for light', 'Commensalism — orchid benefits, tree unaffected'],
            ['Cattle egret following a rhino through grass', 'Commensalism — egret catches disturbed insects, rhino unaffected'],
            ['Elephant trampling small plants while walking', 'Amensalism — plants harmed, elephant unaffected'],
            ['Penicillium mould secreting antibiotics that kill bacteria', 'Amensalism — bacteria killed, mould unaffected'],
          ],
        },
      },
      beginnerContent:
        '**Not every relationship in nature is a dramatic battle or a loving partnership.**\n\n' +
        'Some interactions are lopsided: one species is affected while the other doesn\'t notice at all. ' +
        'These "unequal partnerships" come in two flavours.\n\n' +
        '**Commensalism (+/0) — one benefits, the other is unaffected**\n\n' +
        '| Example | Who Benefits | Who Is Unaffected | How |\n' +
        '|---|---|---|---|\n' +
        '| Orchid on tree branch | Orchid (gets canopy light) | Tree (orchid weight negligible) | Orchid uses aerial roots for moisture, not tree nutrients |\n' +
        '| Cattle egret following rhino | Egret (catches disturbed insects) | Rhino | Large animal movement flushes insects |\n' +
        '| Remora fish on shark | Remora (free transport, food scraps) | Shark | Suction-cup attachment, negligible drag |\n' +
        '| Hermit crab in snail shell | Crab (shelter from predators) | Snail (dead) | Empty shell repurposed |\n' +
        '| Barnacle on whale | Barnacle (transport to food-rich water) | Whale | Weight negligible on a 40-tonne animal |\n\n' +
        'Over 900 orchid species grow as epiphytes — plants that perch on tree branches to access ' +
        'canopy light without being rooted in the ground. They are not parasites: they absorb moisture ' +
        'and nutrients from rain and debris through specialised aerial roots, never tapping into ' +
        'the host tree\'s tissues.\n\n' +
        '**But is "unaffected" ever truly zero?**\n\n' +
        'Strict commensalism is rarer than textbooks suggest. On closer inspection, most commensal ' +
        'interactions involve *some* cost or benefit to the "unaffected" partner:\n\n' +
        '| Interaction | Hidden Cost | Hidden Benefit |\n' +
        '|---|---|---|\n' +
        '| Orchid on tree | Heavy epiphyte loads can break branches | Epiphytes trap moisture, creating humid microhabitats |\n' +
        '| Egret following rhino | Egret alarm calls might disturb rhino grazing | Alarm calls may warn rhino of predators |\n' +
        '| Barnacle on whale | Increases drag very slightly | Barnacles may camouflage the whale\'s skin |\n\n' +
        'Many ecologists now view commensalism as a **point on a spectrum** rather than a fixed category. ' +
        'An interaction that looks commensal at one scale may reveal mutualistic or parasitic elements ' +
        'when studied more closely.\n\n' +
        '**Amensalism (0/−) — one is harmed, the other doesn\'t care**\n\n' +
        'Amensalism is the mirror image of commensalism. One species is harmed while the other is ' +
        'completely unaffected — not because it\'s trying to cause harm, but because it\'s so much ' +
        'larger or more powerful that the interaction is beneath its notice.\n\n' +
        '| Example | Who Is Harmed | Who Is Unaffected |\n' +
        '|---|---|---|\n' +
        '| Elephant walking through forest | Small plants trampled | Elephant — doesn\'t notice |\n' +
        '| Walnut tree producing juglone toxin | Nearby plants (growth inhibited) | Walnut tree (chemical is a by-product) |\n' +
        '| *Penicillium* mould producing antibiotics | Nearby bacteria (killed) | Mould (antibiotic is a by-product of metabolism) |\n\n' +
        '**Analogy: Commensalism is like sitting next to a celebrity on a bus**\n\n' +
        'You get a great story to tell ("I sat next to a film star!"), but the celebrity doesn\'t even ' +
        'notice you. Amensalism is like the celebrity\'s bodyguard accidentally stepping on your foot — ' +
        'you\'re hurt, they didn\'t even register you exist.\n\n' +
        '**Check yourself:** A bird builds a nest in a tree. Is this mutualism, commensalism, or ' +
        'parasitism? Could the answer change depending on the species of bird and tree?',
      intermediateContent:
        '**Interaction classification — the +/0/− framework**\n\n' +
        'Ecologists classify all pairwise species interactions using a simple matrix of positive (+), ' +
        'negative (−), and neutral (0) effects on each partner:\n\n' +
        '| Interaction | Effect on Species A | Effect on Species B | Examples |\n' +
        '|---|---|---|---|\n' +
        '| **Mutualism** | + | + | Mycorrhizae, pollination |\n' +
        '| **Commensalism** | + | 0 | Orchid on tree, remora on shark |\n' +
        '| **Parasitism** | + | − | Malaria, brood parasitism |\n' +
        '| **Competition** | − | − | Herons sharing wetland |\n' +
        '| **Amensalism** | 0 | − | Elephant trampling |\n' +
        '| **Predation** | + | − | Tiger eating deer |\n' +
        '| **Neutralism** | 0 | 0 | Theoretically possible, practically untestable |\n\n' +
        'This framework is useful but oversimplified. The "effect" depends on context:\n\n' +
        '- A mycorrhizal association is mutualistic in phosphorus-poor soil but may become ' +
        '**parasitic** in phosphorus-rich soil (the fungus still takes carbon but the plant doesn\'t ' +
        'need the extra phosphorus)\n' +
        '- Cleaner fish are mutualists when they eat parasites but become parasites themselves when ' +
        'they snack on client mucus instead\n' +
        '- Epiphytic orchids are commensal on a healthy tree but may become harmful on a stressed ' +
        'tree whose branches can\'t bear the extra weight\n\n' +
        '**Context-dependency is the rule, not the exception.** A meta-analysis of 1,500 published ' +
        'interaction studies found that over 40% of interactions shifted category depending on ' +
        'environmental conditions.\n\n' +
        '**Facilitation — positive interactions in harsh environments**\n\n' +
        'The **stress gradient hypothesis** predicts that positive interactions (facilitation, ' +
        'commensalism) become more important in physically harsh environments. A nurse plant that ' +
        'provides shade in a desert may be the difference between life and death for seedlings ' +
        'beneath it — a commensal interaction in mild conditions becomes critical facilitation ' +
        'under stress.\n\n' +
        '| Environment | Dominant Interaction | Reason |\n' +
        '|---|---|---|\n' +
        '| Harsh (desert, alpine, saline) | Facilitation/commensalism | Neighbours buffer physical stress |\n' +
        '| Benign (fertile lowland) | Competition | Resources are sufficient; neighbours are rivals |\n' +
        '| Intermediate | Mix of both | Context-dependent |',
      advancedContent:
        '**Interaction networks beyond pairwise**\n\n' +
        'Real communities involve not two but dozens or hundreds of interacting species. **Higher-order ' +
        'interactions** (HOIs) occur when the effect of species A on species B changes depending on ' +
        'the presence of species C. A pollinator might visit a plant more when a competitor plant is ' +
        'absent — a three-way interaction that pairwise models miss entirely.\n\n' +
        '**Mathematical representation:**\n\n' +
        'Traditional: dNᵢ/dt = Nᵢ(rᵢ + Σ αᵢⱼNⱼ)\n\n' +
        'With HOIs: dNᵢ/dt = Nᵢ(rᵢ + Σ αᵢⱼNⱼ + Σ βᵢⱼₖNⱼNₖ)\n\n' +
        'The βᵢⱼₖ terms capture how the joint presence of species j and k modifies species i\'s growth. ' +
        'Recent theoretical work shows that HOIs can **stabilise coexistence** that would be impossible ' +
        'in pairwise models — potentially explaining why real ecosystems support far more species than ' +
        'simple competition theory predicts.\n\n' +
        '**Interaction modification vs. interaction chains**\n\n' +
        '| Indirect Interaction Type | Definition | Example |\n' +
        '|---|---|---|\n' +
        '| **Interaction chain** | A affects B, B affects C | Predator removes competitor, releasing prey |\n' +
        '| **Interaction modification** | A changes how B affects C | Shade from a tree changes how two grasses compete |\n' +
        '| **Trophic cascade** | Top predator affects producers via intermediate herbivore | Wolves reduce elk grazing, rivers change course |\n' +
        '| **Apparent competition** | Shared predator links two prey species | Deer and moose decline together via shared wolf |\n\n' +
        '**Worked example — the Yellowstone cascade**\n\n' +
        'When wolves were reintroduced to Yellowstone in 1995:\n\n' +
        '1. Wolf predation reduced elk numbers and changed elk behaviour (elk avoided open areas)\n' +
        '2. Willows and aspens recovered along riverbanks (reduced browsing)\n' +
        '3. Beaver populations increased (more willow for food and dams)\n' +
        '4. Beaver dams created pools, changing river hydrology\n' +
        '5. Songbird and fish populations increased in the new habitats\n\n' +
        'A single species reintroduction altered the physical landscape through a cascade of ' +
        'species interactions — demonstrating that interactions, not just species, are the ' +
        'fundamental units of ecosystems.',
    },
    {
      title: 'Coevolution & Interaction Webs',
      diagram: 'BeeFlowerCoevolutionDiagram',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'Darwin predicted the existence of a moth with a 30 cm tongue after seeing a deep-throated orchid in Madagascar. The moth was discovered 41 years later — a stunning confirmation of coevolution.',
            'In Kaziranga, elephants create clearings by pushing down trees. These clearings become grassland habitat for rhinos, wild buffalo, and swamp deer — the elephant is an ecosystem engineer.',
            'Some orchids produce no nectar at all but attract pollinators through deception — mimicking the scent of female insects to lure males into attempting to mate with the flower.',
          ],
        },
      },
      beginnerContent:
        '**When two species shape each other\'s evolution, we call it coevolution.**\n\n' +
        'It\'s like two dancers adjusting their steps to each other. One partner changes, and the ' +
        'other must change in response — or fall behind. Over millions of years, this back-and-forth ' +
        'produces some of nature\'s most extraordinary adaptations.\n\n' +
        '**Darwin\'s prediction — the moth with a 30 cm tongue**\n\n' +
        'In 1862, Charles Darwin received an orchid from Madagascar with a nectar spur nearly 30 cm deep. ' +
        'He predicted that somewhere in Madagascar, a moth must exist with a tongue long enough to reach ' +
        'the nectar — because the orchid could only be pollinated by such a creature. Critics laughed.\n\n' +
        'Forty-one years later, the moth *Xanthopan morganii praedicta* was discovered — with a ' +
        'tongue exactly the right length. The orchid evolved a deeper spur to ensure the moth ' +
        'pressed its face into the pollen. The moth evolved a longer tongue to reach the deeper nectar. ' +
        'Each drove the other to extremes.\n\n' +
        '**Types of coevolution**\n\n' +
        '| Type | Description | Example |\n' +
        '|---|---|---|\n' +
        '| **Pairwise** | Two species drive each other\'s evolution directly | Fig tree and its specific fig wasp |\n' +
        '| **Diffuse** | A group of species drives evolution in another group | Many bee species and many flower species |\n' +
        '| **Arms race** | Parasite and host escalate attack and defence | Cuckoo egg mimicry vs host egg recognition |\n' +
        '| **Mutualistic** | Both partners become better at helping each other | Flower shape evolving to fit pollinator body |\n' +
        '| **Gene-for-gene** | Each resistance gene in host matched by virulence gene in parasite | Wheat rust fungus vs wheat |\n\n' +
        '**Bee-flower coevolution — a love story written in colour**\n\n' +
        'Flowers didn\'t always have petals, colours, or scent. These features evolved specifically to ' +
        'attract animal pollinators — and different pollinators drove different flower designs:\n\n' +
        '| Pollinator | Flower Colour | Flower Shape | Scent | Timing |\n' +
        '|---|---|---|---|---|\n' +
        '| Bees | Blue, yellow, UV patterns | Landing platform, guide lines | Sweet, mild | Day |\n' +
        '| Butterflies | Red, orange, pink | Tubular, narrow | Faint, sweet | Day |\n' +
        '| Moths | White, pale | Tubular, deep nectar spur | Strong, sweet | Night |\n' +
        '| Birds (sunbirds) | Red, orange | Tubular, sturdy | None (birds have poor smell) | Day |\n' +
        '| Bats | White, dull green | Large, bell-shaped | Strong, fermented | Night |\n' +
        '| Flies | Brown, purple | Flat or trap-like | Rotting meat | Day |\n\n' +
        'Bees see ultraviolet light that humans cannot. Many flowers have UV "landing strip" patterns ' +
        'invisible to us but unmistakable to bees — guiding them straight to the nectar and pollen.\n\n' +
        '**Food webs — everyone is connected**\n\n' +
        'No species lives in isolation. Each mutualism, parasitism, competition, and predation event ' +
        'connects to others, forming a **food web** — a map of who eats whom and who depends on whom.\n\n' +
        'Remove one species and others may cascade into decline. When elephants are poached from a ' +
        'forest, trees grow unchecked, grasslands shrink, and grassland-dependent species like rhinos ' +
        'and wild buffalo lose habitat. The elephant is an **ecosystem engineer** — a species that ' +
        'physically modifies the environment in ways that create habitat for others.\n\n' +
        '**Analogy: Coevolution is like an arms race between a locksmith and a burglar**\n\n' +
        'The locksmith builds a better lock; the burglar builds a better pick. Neither side ever ' +
        '"wins" permanently — each improvement by one side forces a response from the other. ' +
        'In nature, this race has been running for hundreds of millions of years.\n\n' +
        '**Check yourself:** Why don\'t flowers just give nectar away for free to every insect? ' +
        'What advantage does specialising in one pollinator type provide?',
      intermediateContent:
        '**Pollination syndromes — testing the coevolution hypothesis**\n\n' +
        'Pollination syndromes — suites of flower traits matching specific pollinator groups — were ' +
        'long considered strong evidence for coevolution. But modern studies show the picture is ' +
        'more nuanced:\n\n' +
        '| Evidence For Syndromes | Evidence Against |\n' +
        '|---|---|\n' +
        '| Flower traits do cluster by primary pollinator type | Most flowers are visited by multiple pollinator types |\n' +
        '| Experimental removal of primary pollinator reduces seed set | Secondary pollinators can compensate partially |\n' +
        '| Convergent evolution (unrelated flowers evolve similar traits for same pollinator) | Many flowers don\'t fit any syndrome neatly |\n' +
        '| Molecular phylogenies show pollinator shifts drive flower trait evolution | Trait evolution may lag behind pollinator shifts |\n\n' +
        'The current consensus: **pollination syndromes describe the most important pollinator**, ' +
        'not the only one. Most plants maintain a "backup" of generalist pollinators.\n\n' +
        '**Ecosystem engineers — species that build worlds**\n\n' +
        'Some species don\'t just participate in food webs — they reshape the physical environment:\n\n' +
        '| Engineer | Action | Habitat Created | Beneficiaries |\n' +
        '|---|---|---|---|\n' +
        '| Elephant | Pushes down trees, creates clearings | Grassland patches in forest | Rhino, wild buffalo, swamp deer |\n' +
        '| Beaver | Builds dams | Ponds and wetlands | Fish, amphibians, waterfowl |\n' +
        '| Earthworm | Burrows through soil | Aerated, nutrient-mixed soil | Plants, microbes, other soil organisms |\n' +
        '| Coral | Builds calcium carbonate reef | Reef habitat | ~25% of all marine species |\n' +
        '| Woodpecker | Excavates tree cavities | Nesting holes | Owls, parakeets, bats, squirrels |\n\n' +
        '**Keystone species — disproportionate impact**\n\n' +
        'A **keystone species** has an ecological effect far larger than its biomass would suggest. ' +
        'Removing it causes a cascade of changes:\n\n' +
        '| Keystone Species | Role | What Happens Without It |\n' +
        '|---|---|---|\n' +
        '| Sea otter | Eats sea urchins | Urchins destroy kelp forests |\n' +
        '| Fig tree | Year-round fruit | Frugivores starve during lean months |\n' +
        '| Wolf | Top predator | Elk overgraze, riverbanks erode |\n' +
        '| Elephant | Ecosystem engineer | Forest encroaches on grassland |\n' +
        '| Bee (*Apis cerana*) | Generalist pollinator | Dozens of plant species lose primary pollinator |',
      advancedContent:
        '**Geographic mosaic of coevolution**\n\n' +
        'Thompson\'s **geographic mosaic theory** (2005) transformed our understanding of coevolution ' +
        'by showing that it is not a species-wide phenomenon but a spatially variable one:\n\n' +
        '| Component | Definition | Consequence |\n' +
        '|---|---|---|\n' +
        '| **Coevolutionary hotspot** | Population where reciprocal selection is strong | Local adaptation of both partners |\n' +
        '| **Coevolutionary coldspot** | Population where selection is one-sided or absent | Traits drift or reflect gene flow from hotspots |\n' +
        '| **Trait remixing** | Gene flow, drift, and mutation shuffle traits across populations | No single population represents the "species-level" interaction |\n\n' +
        'The classic test case: the garter snake and rough-skinned newt in western North America. ' +
        'Newts produce tetrodotoxin (TTX); snakes evolve TTX resistance. In hotspot populations, ' +
        'newts are extremely toxic and snakes extremely resistant. In coldspot populations only ' +
        'kilometres away, toxicity and resistance are both low. Gene flow between populations ' +
        'creates a mosaic of local (mis)match.\n\n' +
        '**Network stability and biodiversity**\n\n' +
        'The relationship between food-web complexity and stability has been debated since May (1972) ' +
        'showed that random complex networks are *less* stable than simple ones. Resolution came from ' +
        'recognising that real food webs are not random:\n\n' +
        '| Structural Feature | Effect on Stability | Mechanism |\n' +
        '|---|---|---|\n' +
        '| Weak interactions predominate | Stabilising | Dampens oscillations between species |\n' +
        '| Nestedness in mutualistic networks | Stabilising for species loss | Generalists buffer specialist extinction |\n' +
        '| Modularity | Stabilising for perturbations | Disturbances contained within modules |\n' +
        '| High connectance | Destabilising in random networks | But stabilising when combined with weak links |\n\n' +
        '**Worked example — cascade modelling**\n\n' +
        'A researcher models a simplified grassland food web with 5 trophic levels:\n\n' +
        '- Grass → Grasshopper → Frog → Snake → Hawk\n' +
        '- Side chain: Grass → Wild buffalo → Tiger\n' +
        '- Cross-link: Frog → Tiger (tiger occasionally eats frogs in wetland areas)\n\n' +
        'If a disease eliminates frogs:\n' +
        '1. Grasshopper population explodes (released from predation)\n' +
        '2. Grass biomass declines (increased herbivory)\n' +
        '3. Snake population crashes (lost primary prey)\n' +
        '4. Hawk switches to rodents (diet flexibility buffers the cascade)\n' +
        '5. Wild buffalo are indirectly affected through reduced grass\n\n' +
        'The cross-link to tiger means the cascade has limited effect on the top predator ' +
        '(diet generality provides resilience). This illustrates why **interaction diversity**, ' +
        'not just species diversity, determines ecosystem resilience.',
    },
  ],
};
