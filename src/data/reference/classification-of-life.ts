import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'classification-of-life',
  title: 'Classification of Living Things',
  category: 'zoology',
  icon: '🔬',
  tagline: 'How scientists organize millions of species — from five kingdoms to binomial naming.',
  relatedStories: ['boy-counted-butterflies', 'kaziranga-grass', 'tiny-frog'],
  understand: [
    {
      title: 'Why We Classify',
      beginnerContent:
        '**Imagine walking into Kaziranga National Park.**\n\n' +
        'You see a one-horned rhino munching tall elephant grass, a monitor lizard sunbathing on a log, ' +
        'an egret standing on the rhino\'s back, and a leech hiding in the mud. Four creatures, four completely ' +
        'different body plans — yet they all share the same swampy grassland. How do scientists make sense of ' +
        'this incredible diversity?\n\n' +
        'The answer is **classification** — the science of grouping organisms by shared characteristics. ' +
        'Without it, biology would be chaos. Every village, language, and country uses different names for the ' +
        'same creature. The one-horned rhino is "gorh" in Assamese, "gainda" in Hindi, and "rhinoceros" in English. ' +
        'Scientists needed one universal name everyone could agree on.\n\n' +
        '**Enter Carl Linnaeus (1707-1778)**\n\n' +
        'This Swedish naturalist created **binomial nomenclature** — a two-part Latin naming system:\n\n' +
        '| Common Name | Scientific Name | Meaning |\n' +
        '|---|---|---|\n' +
        '| One-horned rhino | *Rhinoceros unicornis* | "nose-horn" + "one-horn" |\n' +
        '| Asian elephant | *Elephas maximus* | "elephant" + "greatest" |\n' +
        '| Bengal tiger | *Panthera tigris* | "leopard" + "tiger" |\n' +
        '| Tea plant | *Camellia sinensis* | named after botanist Kamel + "from China" |\n' +
        '| Muga silkworm | *Antheraea assamensis* | "flowery" + "from Assam" |\n\n' +
        'Notice the pattern: **Genus** (capitalised) + **species** (lowercase), always in *italics*.\n\n' +
        '**Analogy: Classification is like your school library**\n\n' +
        'Your school library doesn\'t dump all books in one pile. It organises them:\n\n' +
        '- **Room** → Fiction vs Non-fiction (like Domain)\n' +
        '- **Shelf** → Science, History, Maths (like Kingdom)\n' +
        '- **Section** → Physics, Chemistry, Biology (like Phylum)\n' +
        '- **Sub-section** → Mechanics, Optics (like Class)\n' +
        '- **Specific book** → "Optics for Beginners" (like Species)\n\n' +
        'Each level narrows down until you find exactly what you\'re looking for.\n\n' +
        '**Why does this matter?**\n\n' +
        'NE India is a **biodiversity hotspot** — one of 36 globally. Scientists have documented:\n\n' +
        '| Group | NE India Species | India Total | NE India Share |\n' +
        '|---|---|---|---|\n' +
        '| Flowering plants | ~8,000 | ~18,000 | 44% |\n' +
        '| Orchids | ~900 | ~1,350 | 67% |\n' +
        '| Mammals | ~270 | ~430 | 63% |\n' +
        '| Birds | ~850 | ~1,350 | 63% |\n' +
        '| Amphibians | ~120 | ~450 | 27% |\n\n' +
        'Without classification, how would you keep track of 8,000 plant species? ' +
        'Modern classification uses **DNA analysis** alongside physical traits, sometimes overturning ' +
        'groupings that were based on appearance alone.',
      intermediateContent:
        '**Rules of binomial nomenclature:**\n\n' +
        'Naming isn\'t a free-for-all — strict rules are governed by the **International Code of ' +
        'Zoological Nomenclature** (ICZN) for animals and the **International Code of Nomenclature for ' +
        'algae, fungi, and plants** (ICN).\n\n' +
        '| Rule | Example | Why It Matters |\n' +
        '|---|---|---|\n' +
        '| Genus capitalised, species lowercase | *Rhinoceros unicornis* | Consistency worldwide |\n' +
        '| Always italicised (or underlined) | *Elephas maximus* | Signals it\'s a scientific name |\n' +
        '| Latin or Latinised | *Antheraea assamensis* | Language-neutral |\n' +
        '| Type specimen required | Preserved in a museum | Definitive physical reference |\n' +
        '| Published in peer-reviewed literature | With Latin diagnosis | Prevents duplicates |\n' +
        '| Priority rule | First valid name wins | Avoids naming conflicts |\n\n' +
        '**What is a "species" exactly?**\n\n' +
        'This sounds simple but is surprisingly tricky. Multiple definitions compete:\n\n' +
        '| Species Concept | Definition | Limitation |\n' +
        '|---|---|---|\n' +
        '| Biological (Mayr, 1942) | Can interbreed, produce fertile offspring | Fails for bacteria, fossils |\n' +
        '| Morphological | Physically distinct and consistent | Cryptic species look identical |\n' +
        '| Phylogenetic | Smallest monophyletic group on a tree | Where to draw the line? |\n' +
        '| Genetic | >97% 16S rRNA similarity (bacteria) | Arbitrary threshold |\n\n' +
        '**NE India discovery rate:** ~18,000 new species are described globally each year. ' +
        'In 2023 alone, researchers described several new frog species from Meghalaya\'s caves ' +
        'and new orchid species from Arunachal Pradesh. An estimated **80% of Earth\'s species ' +
        'remain undiscovered** — many likely in biodiversity hotspots like the Eastern Himalayas.',
      advancedContent:
        '**Cladistics — reconstructing the tree of life**\n\n' +
        'Modern systematics uses **cladistics** (Willi Hennig, 1950) to determine evolutionary ' +
        'relationships. Key concepts:\n\n' +
        '| Term | Definition | Example |\n' +
        '|---|---|---|\n' +
        '| Clade | Ancestor + all descendants | Mammalia is a clade |\n' +
        '| Synapomorphy | Shared **derived** character | Hair defines mammals |\n' +
        '| Symplesiomorphy | Shared **ancestral** character | Vertebral column (too broad) |\n' +
        '| Monophyletic | Contains all descendants of an ancestor | Birds = dinosaur clade |\n' +
        '| Paraphyletic | Excludes some descendants | "Reptiles" without birds |\n' +
        '| Polyphyletic | No common ancestor | "Warm-blooded animals" |\n\n' +
        '**Tree-building methods:**\n\n' +
        '- **Maximum parsimony** — fewest evolutionary changes\n' +
        '- **Maximum likelihood** — most probable tree given a substitution model\n' +
        '- **Bayesian inference** (MrBayes, BEAST) — samples tree topologies proportionally to posterior ' +
        'probability using MCMC algorithms, providing statistical confidence at each node\n\n' +
        '**DNA barcoding** uses a standardised gene region to identify species rapidly:\n\n' +
        '| Organism Group | Barcode Gene | Length | Accuracy |\n' +
        '|---|---|---|---|\n' +
        '| Animals | COI (cytochrome c oxidase I) | ~650 bp | >95% |\n' +
        '| Plants | rbcL + matK | ~1,400 bp | ~85% |\n' +
        '| Fungi | ITS (internal transcribed spacer) | ~500 bp | >90% |\n\n' +
        'Applications range from food fraud detection (is that "salmon" actually tilapia?) ' +
        'to biosecurity screening at ports.',
      diagram: 'GrassRhinoHabitatDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each species to its scientific name',
          pairs: [
            ['One-horned rhino', 'Rhinoceros unicornis'],
            ['Asian elephant', 'Elephas maximus'],
            ['Bengal tiger', 'Panthera tigris'],
            ['Gangetic dolphin', 'Platanista gangetica'],
            ['Muga silkworm', 'Antheraea assamensis'],
            ['Hoolock gibbon', 'Hoolock hoolock'],
          ],
        },
      },
    },
    {
      title: 'Five Kingdoms',
      beginnerContent:
        '**Sorting 8 million species into 5 groups**\n\n' +
        'In 1969, Robert Whittaker proposed dividing all life into **five kingdoms** based on three ' +
        'simple questions:\n\n' +
        '1. Does the cell have a **nucleus**? (Prokaryotic vs Eukaryotic)\n' +
        '2. Is it **one cell** or **many cells**? (Unicellular vs Multicellular)\n' +
        '3. How does it get **food**? (Makes it / Absorbs it / Eats it)\n\n' +
        '**The Five Kingdoms at a glance:**\n\n' +
        '| Kingdom | Cell Type | Cell Count | Nutrition | Example |\n' +
        '|---|---|---|---|---|\n' +
        '| Monera | Prokaryotic | Unicellular | All modes | Cyanobacteria in Deepor Beel |\n' +
        '| Protista | Eukaryotic | Mostly unicellular | All modes | Amoebae in paddy-field water |\n' +
        '| Fungi | Eukaryotic | Mostly multicellular | Absorptive | Mushrooms on Khasi Hills forest floor |\n' +
        '| Plantae | Eukaryotic | Multicellular | Photosynthesis | Rhododendrons of Dzukou Valley |\n' +
        '| Animalia | Eukaryotic | Multicellular | Ingestive | One-horned rhino of Kaziranga |\n\n' +
        '**Let\'s explore each kingdom:**\n\n' +
        '**Kingdom Monera** — the ancient ones\n\n' +
        'Monerans are prokaryotes — their cells lack a membrane-bound nucleus. They include bacteria and ' +
        'cyanobacteria (blue-green algae). They\'re the oldest life forms on Earth (~3.5 billion years). ' +
        'You\'ll find them everywhere: in your gut, in soil, in the hot springs of Meghalaya, and in the ' +
        'waterlogged paddy fields of Assam. Some make food through photosynthesis, some absorb nutrients, ' +
        'and some are parasites.\n\n' +
        '**Kingdom Protista** — the misfits\n\n' +
        'Protists are a diverse grab-bag of mostly single-celled eukaryotes. Amoebae extend pseudopods ' +
        'to crawl, paramecia swim using cilia, and euglena can both photosynthesize AND eat. The ponds ' +
        'and beels (oxbow lakes) of Assam teem with protists visible under a simple microscope. Scoop ' +
        'water from Deepor Beel and you\'ll find dozens of species in a single drop.\n\n' +
        '**Kingdom Fungi** — the recyclers\n\n' +
        'Mushrooms, moulds, and yeasts. They decompose dead matter by secreting enzymes externally ' +
        'and absorbing the digested nutrients. Without fungi, dead leaves and fallen trees would pile up ' +
        'forever. The forests of Meghalaya and Nagaland are rich in wild mushroom diversity.\n\n' +
        '**Kingdom Plantae** — the food factories\n\n' +
        'All multicellular photosynthetic organisms — mosses, ferns, flowering plants, towering trees. ' +
        'They have cell walls made of cellulose. NE India is a botanical treasure house:\n\n' +
        '| Plant Group | NE India Highlight |\n' +
        '|---|---|\n' +
        '| Orchids | ~900 species — 67% of India\'s total |\n' +
        '| Rhododendrons | ~40 species in Arunachal Pradesh |\n' +
        '| Bamboo | ~60 species — "green gold" of the northeast |\n' +
        '| Pitcher plants | *Nepenthes khasiana* — only in Meghalaya |\n' +
        '| Ferns | ~500 species in cloud forests |\n\n' +
        '**Kingdom Animalia** — the movers\n\n' +
        'All multicellular heterotrophs that ingest food. No cell walls, generally motile, have nervous ' +
        'systems. Kaziranga alone hosts 35 mammal species, 480+ bird species, and countless invertebrates.',
      intermediateContent:
        '**Comparing the five kingdoms — detailed criteria:**\n\n' +
        '| Feature | Monera | Protista | Fungi | Plantae | Animalia |\n' +
        '|---|---|---|---|---|---|\n' +
        '| Nucleus | No | Yes | Yes | Yes | Yes |\n' +
        '| Cell wall | Peptidoglycan | Varies | Chitin | Cellulose | None |\n' +
        '| Organelles | None (membrane-bound) | All | All | All + chloroplasts | All |\n' +
        '| Reproduction | Binary fission | All modes | Spores | Spores + seeds | Sexual (mostly) |\n' +
        '| Movement | Flagella/none | Cilia/flagella/pseudopods | None | None | Muscles |\n' +
        '| Examples (count) | ~10,000 named | ~80,000 | ~150,000 | ~400,000 | ~1.5 million |\n\n' +
        '**Animal phyla by species count:**\n\n' +
        '| Phylum | Example | Approx. Species | % of Animals |\n' +
        '|---|---|---|---|\n' +
        '| Arthropoda | Insects, spiders, crabs | ~1,200,000 | 85% |\n' +
        '| Mollusca | Snails, octopus, clams | ~85,000 | 6% |\n' +
        '| Chordata | Fish, birds, mammals | ~66,000 | 5% |\n' +
        '| Nematoda | Roundworms | ~25,000 | 2% |\n' +
        '| Annelida | Earthworms, leeches | ~17,000 | 1% |\n' +
        '| Placozoa | *Trichoplax adhaerens* | 1 | <0.001% |\n\n' +
        'Note: Arthropoda dominates because of **insects** — beetles alone (~400,000 species) outnumber ' +
        'all vertebrate species combined. When asked what his studies revealed about God, biologist ' +
        'J.B.S. Haldane reportedly replied: "An inordinate fondness for beetles."\n\n' +
        '**Why Protista is problematic:**\n\n' +
        'Kingdom Protista is now recognised as **paraphyletic** — it\'s not a natural group. ' +
        'Molecular phylogenetics shows that protists belong to multiple unrelated lineages. ' +
        'Some protists (like choanoflagellates) are more closely related to animals than to ' +
        'other protists. Modern systems break Protista into several independent groups.',
      advancedContent:
        '**Beyond five kingdoms — phylogenomic supergroups**\n\n' +
        'The five-kingdom system has been superseded in research by **whole-genome analyses** that ' +
        'reveal surprising relationships:\n\n' +
        '| Supergroup | Includes | Surprise Fact |\n' +
        '|---|---|---|\n' +
        '| Opisthokonta | Animals + Fungi | You are more closely related to a mushroom than to a plant |\n' +
        '| Amoebozoa | Amoebae, slime moulds | Some form multicellular fruiting bodies |\n' +
        '| Archaeplastida | Plants + green/red algae | United by primary plastid endosymbiosis |\n' +
        '| SAR | Diatoms, ciliates, foraminifera | Stramenopiles + Alveolates + Rhizaria |\n' +
        '| Excavata | Euglena, trypanosomes | Includes sleeping-sickness parasite |\n\n' +
        'The root of the eukaryotic tree remains contested. The leading hypothesis splits eukaryotes into ' +
        '**Amorphea** (Opisthokonta + Amoebozoa) vs **Diaphoretickes** (everything else).\n\n' +
        '**Metagenomics — counting the uncountable:**\n\n' +
        'By sequencing all DNA directly from environmental samples (no culturing needed), metagenomics ' +
        'has revealed vast microbial diversity:\n\n' +
        '- Soil: ~10,000 bacterial species per gram, most never cultured\n' +
        '- Ocean (Tara Oceans project): >35,000 plankton species from ~150 million genetic barcodes\n' +
        '- Human gut: ~1,000 bacterial species, ~3 million unique genes (150x the human genome)\n\n' +
        'A single water sample from Umiam Lake in Meghalaya could contain thousands of microbial species ' +
        'invisible to the naked eye — each one classifiable only through DNA.',
      diagram: 'FiveKingdomsDiagram',
      interactive: {
        type: 'true-false',
        props: {
          title: 'True or False — Five Kingdoms',
          questions: [
            { statement: 'Bacteria have a membrane-bound nucleus.', answer: false, explanation: 'Bacteria are prokaryotes — they lack a membrane-bound nucleus. That\'s what defines Kingdom Monera.' },
            { statement: 'Fungi get food by absorbing nutrients externally.', answer: true, explanation: 'Fungi secrete enzymes onto their food source and absorb the digested nutrients — this is called absorptive heterotrophy.' },
            { statement: 'Arthropods make up about 85% of all animal species.', answer: true, explanation: 'With ~1.2 million described species (mostly insects), Arthropoda is by far the largest animal phylum.' },
            { statement: 'Plants and animals both have cell walls.', answer: false, explanation: 'Plants have cell walls made of cellulose. Animal cells have no cell wall — only a flexible cell membrane.' },
            { statement: 'Protista is now considered a true natural group.', answer: false, explanation: 'Molecular evidence shows Protista is paraphyletic — its members belong to multiple unrelated lineages.' },
          ],
        },
      },
    },
    {
      title: 'Taxonomy Hierarchy',
      beginnerContent:
        '**Eight levels — from broadest to most specific**\n\n' +
        'Linnaeus\'s classification arranges organisms into a nested hierarchy. A handy mnemonic:\n\n' +
        '> **"Dear King Philip Came Over For Good Spaghetti"**\n\n' +
        '| Rank | Mnemonic | What It Means |\n' +
        '|---|---|---|\n' +
        '| **D**omain | Dear | Broadest group (3 domains of life) |\n' +
        '| **K**ingdom | King | Major life divisions (Animalia, Plantae, etc.) |\n' +
        '| **P**hylum | Philip | Body plan (vertebrates vs invertebrates, etc.) |\n' +
        '| **C**lass | Came | Major subgroups (mammals, birds, reptiles) |\n' +
        '| **O**rder | Over | Clusters of related families |\n' +
        '| **F**amily | For | Clusters of related genera |\n' +
        '| **G**enus | Good | Very closely related species |\n' +
        '| **S**pecies | Spaghetti | Single type of organism |\n\n' +
        '**Worked example: Classifying the one-horned rhino of Kaziranga**\n\n' +
        'Let\'s trace *Rhinoceros unicornis* through every level:\n\n' +
        '| Rank | Classification | What It Tells You | Who Else Is Here? |\n' +
        '|---|---|---|---|\n' +
        '| Domain | Eukarya | Cells have a nucleus | All animals, plants, fungi |\n' +
        '| Kingdom | Animalia | Multicellular, eats food | Elephants, butterflies, fish |\n' +
        '| Phylum | Chordata | Has a spinal cord | Fish, frogs, birds, tigers |\n' +
        '| Class | Mammalia | Warm-blooded, hair, milk | Elephants, bats, dolphins |\n' +
        '| Order | Perissodactyla | Odd-toed ungulates | Horses, tapirs, zebras |\n' +
        '| Family | Rhinocerotidae | Rhino family | All 5 rhino species |\n' +
        '| Genus | *Rhinoceros* | Asian one-horned rhinos | Only the Indian & Javan rhino |\n' +
        '| Species | *R. unicornis* | Indian one-horned rhino | **Just this species** |\n\n' +
        'Notice how each step narrows the group. At the phylum level, the rhino shares company with ' +
        'fish and frogs. By the genus level, only two rhino species remain.\n\n' +
        '**The three-domain system**\n\n' +
        'Carl Woese (1990) added a level above Kingdom based on ribosomal RNA analysis:\n\n' +
        '| Domain | Cell Type | Key Feature | Example |\n' +
        '|---|---|---|---|\n' +
        '| Bacteria | Prokaryotic | Peptidoglycan cell walls | *E. coli*, cyanobacteria |\n' +
        '| Archaea | Prokaryotic | Unique membrane chemistry | Hot spring organisms |\n' +
        '| Eukarya | Eukaryotic | Membrane-bound nucleus | All plants, animals, fungi |\n\n' +
        '**The big surprise:** Despite both being prokaryotes, Archaea are actually more closely related ' +
        'to Eukarya (you!) than to Bacteria. Physical appearance alone could never have revealed this — ' +
        'it took DNA analysis.\n\n' +
        '**Try it yourself:** Classify the Asian elephant (*Elephas maximus*): Domain: Eukarya → Kingdom: ' +
        'Animalia → Phylum: Chordata → Class: Mammalia → Order: Proboscidea → Family: Elephantidae → ' +
        'Genus: *Elephas* → Species: *E. maximus*.',
      intermediateContent:
        '**Molecular basis of the three-domain system:**\n\n' +
        'All cells contain ribosomes with a conserved small-subunit rRNA:\n\n' +
        '| Feature | Bacteria | Archaea | Eukarya |\n' +
        '|---|---|---|---|\n' +
        '| rRNA type | 16S (~1,500 nt) | 16S (~1,500 nt) | 18S (~1,800 nt) |\n' +
        '| Membrane lipids | Ester-linked fatty acids | Ether-linked isoprenoids | Ester-linked fatty acids |\n' +
        '| Cell wall | Peptidoglycan | Pseudopeptidoglycan/S-layer | Cellulose/chitin/none |\n' +
        '| RNA polymerase | Simple (5 subunits) | Complex (12+ subunits) | Complex (12+ subunits) |\n' +
        '| Introns | Rare | Some | Common |\n' +
        '| Histones | No | Yes | Yes |\n\n' +
        'By aligning 16S/18S rRNA sequences across thousands of species, Woese showed that Archaea and Bacteria ' +
        'are as different from each other as either is from Eukarya. Note how Archaea share several features ' +
        'with Eukarya (RNA polymerase, histones) — evidence of their closer kinship.\n\n' +
        '**Extremophile Archaea:**\n\n' +
        '| Organism | Extreme Environment | Survives At |\n' +
        '|---|---|---|\n' +
        '| *Thermus aquaticus* | Hot springs | 80°C (used in PCR!) |\n' +
        '| *Halobacterium* | Salt lakes | >30% NaCl |\n' +
        '| *Picrophilus* | Acid pools | pH 0 |\n' +
        '| *Methanopyrus* | Deep-sea vents | 122°C — record holder |\n\n' +
        '**Worked example: How different are two species?**\n\n' +
        'Compare the classification of a rhino and a tiger:\n\n' +
        '| Rank | Rhino | Tiger | Same? |\n' +
        '|---|---|---|---|\n' +
        '| Domain | Eukarya | Eukarya | Yes |\n' +
        '| Kingdom | Animalia | Animalia | Yes |\n' +
        '| Phylum | Chordata | Chordata | Yes |\n' +
        '| Class | Mammalia | Mammalia | Yes |\n' +
        '| Order | Perissodactyla | Carnivora | **No** |\n' +
        '| Family | Rhinocerotidae | Felidae | No |\n\n' +
        'They share the same class (both mammals) but diverge at the order level — they\'ve been ' +
        'evolving separately for ~85 million years.',
      advancedContent:
        '**Phylogenetic tree construction — the four-step pipeline:**\n\n' +
        '| Step | Method | Details |\n' +
        '|---|---|---|\n' +
        '| 1. Sequence alignment | MUSCLE, MAFFT | Minimise gap penalties, maximise matches |\n' +
        '| 2. Model selection | JC69, GTR+G+I | Model substitution rates, base frequencies |\n' +
        '| 3. Tree inference | ML or Bayesian | Search tree space for best topology |\n' +
        '| 4. Support assessment | Bootstrap / posteriors | Statistical confidence at each node |\n\n' +
        '**Substitution models compared:**\n\n' +
        '| Model | Assumptions | Parameters | Use Case |\n' +
        '|---|---|---|---|\n' +
        '| JC69 | Equal base freq, equal rates | 0 | Quick estimates |\n' +
        '| K2P | Equal freq, Ti/Tv different | 1 | Simple sequences |\n' +
        '| HKY | Unequal freq, Ti/Tv different | 4 | Moderate complexity |\n' +
        '| GTR+G+I | Unequal everything + rate variation | 9+ | Gold standard |\n\n' +
        '**Maximum likelihood** searches tree space for the topology maximising P(data|tree, model). ' +
        '**Bayesian methods** (MrBayes, BEAST) sample the posterior P(tree|data) proportional to ' +
        'P(data|tree) x P(tree) using MCMC, providing posterior probabilities for each node.\n\n' +
        '**The molecular clock hypothesis** (Zuckerkandl & Pauling, 1962): substitution rates are ' +
        'roughly constant over time. Relaxed clock models allow rate variation across lineages, ' +
        'calibrated with fossil constraints. This lets us estimate divergence times — e.g., humans ' +
        'and chimps diverged ~6-7 million years ago based on molecular clock analysis.\n\n' +
        'The **Tree of Life** project aims to reconstruct relationships of all ~2.3 million named ' +
        'species — the most data-intensive project in computational biology.',
      diagram: 'TaxonomyHierarchyDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each taxonomic rank to its level',
          pairs: [
            ['Domain', 'Broadest — 3 groups of all life'],
            ['Kingdom', 'Animalia, Plantae, Fungi, etc.'],
            ['Phylum', 'Body plan — Chordata, Arthropoda'],
            ['Class', 'Mammalia, Reptilia, Aves'],
            ['Order', 'Carnivora, Primates, Proboscidea'],
            ['Species', 'Most specific — one type of organism'],
          ],
        },
      },
    },
    {
      title: 'Dichotomous Keys',
      beginnerContent:
        '**A step-by-step species detective tool**\n\n' +
        '"Dichotomous" comes from Greek for "cutting in two." At each step, you observe a feature ' +
        'and pick one of two choices. Each choice leads to either an identification or the next pair ' +
        'of choices. It\'s like a game of 20 Questions — but for animals and plants.\n\n' +
        '**Worked example: Identify a large mammal in Kaziranga**\n\n' +
        '| Step | Question | If YES | If NO |\n' +
        '|---|---|---|---|\n' +
        '| 1 | Does it have a trunk? | **Asian elephant** (*Elephas maximus*) | Go to Step 2 |\n' +
        '| 2 | Does it have a horn on its snout? | **One-horned rhino** (*Rhinoceros unicornis*) | Go to Step 3 |\n' +
        '| 3 | Does it have hooves? | Go to Step 4 | Go to Step 5 |\n' +
        '| 4 | Horns curve backward? | **Swamp deer** (*Rucervus duvaucelii*) | **Wild water buffalo** (*Bubalus arnee*) |\n' +
        '| 5 | Does it have stripes? | **Bengal tiger** (*Panthera tigris*) | Go to Step 6 |\n' +
        '| 6 | Spotted coat, long tail? | **Clouded leopard** (*Neofelis nebulosa*) | Other species |\n\n' +
        '**How it works — the branching logic:**\n\n' +
        'Each question **eliminates half** the remaining possibilities. For 100 species, a well-built ' +
        'key needs only about 7 steps (since 2^7 = 128 > 100). That\'s the power of binary splitting.\n\n' +
        '**Analogy: It\'s like the number-guessing game**\n\n' +
        'If someone picks a number between 1 and 100, you don\'t guess randomly. You ask: ' +
        '"Is it above 50?" Then "Above 75?" Each question halves the search space. ' +
        'A dichotomous key does the same thing with physical features.\n\n' +
        '**Try building your own key!**\n\n' +
        'Pick 5 animals you know from your area. Write yes/no questions that separate them one by one:\n\n' +
        '| Feature to Check | Good for Separating |\n' +
        '|---|---|\n' +
        '| Number of legs | Insects (6) vs spiders (8) vs mammals (4) |\n' +
        '| Wings present? | Birds vs ground mammals |\n' +
        '| Scales or fur? | Reptiles vs mammals |\n' +
        '| Lives in water? | Fish vs land animals |\n' +
        '| Larger than a cat? | Large mammals vs small ones |',
      intermediateContent:
        '**Designing effective keys — the art of choosing characters:**\n\n' +
        'Not all features make good key characters. The best ones are:\n\n' +
        '| Criterion | Good Character | Bad Character |\n' +
        '|---|---|---|\n' +
        '| Consistently present | Wing vein pattern | Body colour (varies) |\n' +
        '| Easy to observe | Leaf arrangement | Internal organ shape |\n' +
        '| Clearly binary | Thorns present vs absent | "Tall" vs "short" |\n' +
        '| Not age-dependent | Number of toes | Body size (grows) |\n' +
        '| Not seasonal | Bark texture | Flower colour (seasonal) |\n\n' +
        '**Worked example — a key for Assam\'s common trees:**\n\n' +
        '| Step | Character | Option A | Option B |\n' +
        '|---|---|---|---|\n' +
        '| 1 | Leaf type | Simple → Step 2 | Compound → Step 4 |\n' +
        '| 2 | Leaf arrangement | Alternate → Step 3 | Opposite → **Teak** |\n' +
        '| 3 | Leaf margin | Entire → **Banyan** | Serrate → **Sal** |\n' +
        '| 4 | Leaflet count | 3 leaflets → **Palash** | >3 leaflets → **Neem** |\n\n' +
        '**Key efficiency:**\n\n' +
        'A well-balanced key for N species requires ~log2(N) steps:\n\n' +
        '| Species Count | Ideal Steps | Badly Built Key |\n' +
        '|---|---|---|\n' +
        '| 8 | 3 | 7 |\n' +
        '| 32 | 5 | 31 |\n' +
        '| 100 | 7 | 99 |\n' +
        '| 1,000 | 10 | 999 |\n\n' +
        '**Multi-access (polychotomous) keys** allow users to enter at any character rather than ' +
        'following a fixed sequence — more flexible but harder to construct. Digital apps like ' +
        'iNaturalist use this approach.',
      advancedContent:
        '**Machine learning replaces traditional keys**\n\n' +
        'Modern species identification increasingly uses AI classifiers:\n\n' +
        '| Method | Technology | Species Coverage | Accuracy |\n' +
        '|---|---|---|---|\n' +
        '| Photo ID (iNaturalist) | CNN (convolutional neural net) | ~76,000 species | >90% |\n' +
        '| Bird song ID (BirdNET) | Spectrogram + CNN | ~6,000 species | >95% |\n' +
        '| DNA metabarcoding | Illumina sequencing | All species in sample | >99% |\n' +
        '| eDNA detection | qPCR / ddPCR | Target species | Detects ~10 copies/L |\n\n' +
        '**DNA metabarcoding pipeline:**\n\n' +
        '1. Collect environmental sample (water, soil, faeces)\n' +
        '2. Extract total DNA\n' +
        '3. Amplify barcode gene (COI for animals, ITS for fungi)\n' +
        '4. Sequence on Illumina platform\n' +
        '5. Match against reference databases (BOLD, GenBank)\n\n' +
        '**eDNA in conservation:**\n\n' +
        'An environmental DNA water sample from the Brahmaputra can detect the presence of the endangered ' +
        'Gangetic river dolphin (*Platanista gangetica*) without ever seeing the animal. DNA shed from ' +
        'skin, faeces, or mucus persists in water for 1-3 weeks and is detectable at concentrations ' +
        'as low as ~10 copies per litre using qPCR or digital droplet PCR.\n\n' +
        'This technique is transforming biodiversity surveys in remote areas of Arunachal Pradesh and ' +
        'Meghalaya, where traditional surveys are logistically difficult. A single litre of river water ' +
        'can reveal the presence of dozens of fish species that might take weeks to survey by netting.',
      diagram: 'DichotomousKeyDiagram',
      interactive: {
        type: 'true-false',
        props: {
          title: 'True or False — Dichotomous Keys',
          questions: [
            { statement: 'A dichotomous key offers three choices at each step.', answer: false, explanation: '"Dichotomous" means "cutting in two" — each step always has exactly two choices.' },
            { statement: 'A good key for 100 species needs about 7 steps.', answer: true, explanation: 'A well-balanced binary key needs ~log2(N) steps. log2(100) is about 6.6, so ~7 steps.' },
            { statement: 'Body colour is usually a reliable key character.', answer: false, explanation: 'Colour often varies with age, sex, and season, making it unreliable as a diagnostic character.' },
            { statement: 'eDNA can detect species from a water sample without seeing the animal.', answer: true, explanation: 'Animals shed DNA into water from skin, faeces, and mucus. This eDNA can be extracted and sequenced.' },
          ],
        },
      },
    },
    {
      title: 'Phylogenetic Trees & Biodiversity',
      beginnerContent:
        '**Family trees — but for all of life**\n\n' +
        'A phylogenetic tree is like a family tree that shows how species are related through evolution. ' +
        'Instead of showing parents and grandparents, it shows which species share a common ancestor ' +
        'and when they split apart.\n\n' +
        '**How to read a phylogenetic tree:**\n\n' +
        '| Tree Feature | What It Means | Analogy |\n' +
        '|---|---|---|\n' +
        '| Branch tip | A living species | A person alive today |\n' +
        '| Branch point (node) | A common ancestor | A grandparent |\n' +
        '| Branch length | Amount of change | How different they\'ve become |\n' +
        '| Closer branches | More closely related | Siblings vs cousins |\n\n' +
        '**Surprising relationships revealed by DNA:**\n\n' +
        '| You Might Think... | But DNA Shows... |\n' +
        '|---|---|\n' +
        '| Hippos are close to pigs | Hippos are closest living relatives of **whales** |\n' +
        '| Birds are related to lizards | Birds are actually **dinosaurs** (theropod clade) |\n' +
        '| Mushrooms are like plants | Fungi are closer to **animals** than plants |\n' +
        '| All "worms" are related | Earthworms, flatworms, and roundworms are in 3 different phyla |\n\n' +
        '**NE India\'s place on the tree of life:**\n\n' +
        'Northeast India sits at the junction of three biogeographic regions — Indo-Malayan, ' +
        'Palearctic, and Sino-Japanese. This is why you find such extraordinary diversity:\n\n' +
        '| Animal Group | NE India Highlights |\n' +
        '|---|---|\n' +
        '| Primates | Hoolock gibbon — India\'s only ape |\n' +
        '| Amphibians | New frog species discovered every year in Meghalaya |\n' +
        '| Birds | 850+ species — more than all of Europe |\n' +
        '| Butterflies | 1,500+ species — Namdapha alone has 500+ |\n' +
        '| Freshwater fish | 300+ species in Brahmaputra basin |\n\n' +
        '**Check yourself:** If two animals are on branches that meet at a recent node, they are ' +
        '(more/less) closely related than two animals whose branches meet at an ancient node? ' +
        'Answer: **More** closely related — they shared an ancestor recently.',
      intermediateContent:
        '**Reading phylogenetic trees quantitatively:**\n\n' +
        'Trees can be drawn as **cladograms** (branching pattern only) or **phylograms** (branch ' +
        'length proportional to evolutionary change). A **chronogram** scales branches to time using ' +
        'fossil calibration points.\n\n' +
        '**Key tree vocabulary:**\n\n' +
        '| Term | Definition | Example |\n' +
        '|---|---|---|\n' +
        '| Sister taxa | Two groups sharing the nearest common ancestor | Humans & chimps |\n' +
        '| Outgroup | A distantly related taxon used to root the tree | Lizard in a mammal tree |\n' +
        '| Polytomy | Node with >2 branches (unresolved) | Indicates uncertainty |\n' +
        '| Rooted tree | Has a defined ancestor direction | Shows evolutionary direction |\n' +
        '| Unrooted tree | Shows relationships but no direction | Common in initial analysis |\n\n' +
        '**Biodiversity metrics:**\n\n' +
        '| Metric | Formula/Method | What It Measures |\n' +
        '|---|---|---|\n' +
        '| Species richness | Simple count of species | Raw diversity |\n' +
        '| Shannon index (H\') | H\' = -Sum(pi x ln pi) | Diversity + evenness |\n' +
        '| Simpson index (D) | D = 1 - Sum(pi^2) | Dominance probability |\n' +
        '| Phylogenetic diversity | Sum of branch lengths | Evolutionary uniqueness |\n\n' +
        '**Worked example: Shannon index for a Kaziranga grassland plot**\n\n' +
        'Suppose you count 100 individual mammals and find 4 species:\n\n' +
        '| Species | Count | Proportion (pi) | pi x ln(pi) |\n' +
        '|---|---|---|---|\n' +
        '| Rhino | 40 | 0.40 | -0.366 |\n' +
        '| Deer | 30 | 0.30 | -0.361 |\n' +
        '| Buffalo | 20 | 0.20 | -0.322 |\n' +
        '| Elephant | 10 | 0.10 | -0.230 |\n' +
        '| **Total** | **100** | **1.00** | **-1.279** |\n\n' +
        'H\' = -(-1.279) = **1.279** (moderate diversity; max for 4 species = ln(4) = 1.386).',
      advancedContent:
        '**Phylogenetic comparative methods:**\n\n' +
        'Once you have a phylogeny, you can test evolutionary hypotheses:\n\n' +
        '| Method | Question It Answers | Key Concept |\n' +
        '|---|---|---|\n' +
        '| Ancestral state reconstruction | What did the ancestor look like? | Parsimony or ML on tree |\n' +
        '| Independent contrasts | Do two traits co-evolve? | Controls for shared ancestry |\n' +
        '| Diversification analysis | Why do some clades have more species? | Birth-death models |\n' +
        '| Biogeographic analysis | Where did a lineage originate? | DEC model, vicariance |\n\n' +
        '**Why NE India is a biodiversity hotspot — biogeographic explanation:**\n\n' +
        'The Eastern Himalayas\' extraordinary diversity results from:\n\n' +
        '1. **Tectonic history** — India\'s collision with Asia (~50 MYA) created the Himalayas, ' +
        'generating extreme altitudinal gradients (0-8,000m) and rain shadows\n' +
        '2. **Glacial refugia** — during ice ages, tropical species retreated to NE India\'s valleys, ' +
        'which remained warm and wet, promoting speciation in isolation\n' +
        '3. **Biogeographic junction** — three realms overlap here, contributing species from each\n' +
        '4. **High rainfall** — Mawsynram receives ~12,000 mm/year, supporting dense tropical forests\n\n' +
        '**Conservation phylogenetics:**\n\n' +
        'The EDGE (Evolutionarily Distinct and Globally Endangered) metric prioritises species that ' +
        'are both phylogenetically unique and threatened. NE India\'s EDGE species include the pygmy hog ' +
        '(*Porcula salvania* — most distinct pig, only 250 left) and the Assam roofed turtle ' +
        '(*Pangshura sylhetensis* — ancient lineage, critically endangered).\n\n' +
        'Losing an EDGE species means losing millions of years of unique evolutionary history ' +
        'that no other species carries.',
      diagram: 'PhylogeneticTreeDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each biodiversity metric to what it measures',
          pairs: [
            ['Species richness', 'Simple count of species in an area'],
            ['Shannon index', 'Diversity accounting for evenness'],
            ['Simpson index', 'Probability two individuals differ'],
            ['Phylogenetic diversity', 'Total evolutionary branch length'],
            ['EDGE score', 'Evolutionary uniqueness + threat level'],
          ],
        },
      },
    },
    {
      title: 'NE India Field Classification',
      beginnerContent:
        '**Putting it all together — classify what you see**\n\n' +
        'Northeast India is a living classroom for classification. Let\'s apply everything we\'ve ' +
        'learned to real organisms you might encounter on a nature walk.\n\n' +
        '**Field guide: Common animals of Kaziranga and their classification**\n\n' +
        '| Animal | Kingdom | Phylum | Class | Order | Key Feature |\n' +
        '|---|---|---|---|---|---|\n' +
        '| One-horned rhino | Animalia | Chordata | Mammalia | Perissodactyla | Odd-toed hooves |\n' +
        '| Asian elephant | Animalia | Chordata | Mammalia | Proboscidea | Trunk |\n' +
        '| Bengal tiger | Animalia | Chordata | Mammalia | Carnivora | Retractable claws |\n' +
        '| Gangetic dolphin | Animalia | Chordata | Mammalia | Artiodactyla | Echolocation |\n' +
        '| Greater adjutant stork | Animalia | Chordata | Aves | Ciconiiformes | Wading legs |\n' +
        '| King cobra | Animalia | Chordata | Reptilia | Squamata | Scales, venom |\n' +
        '| Golden mahseer (fish) | Animalia | Chordata | Actinopterygii | Cypriniformes | Ray fins |\n\n' +
        '**Quick classification challenge:**\n\n' +
        'You find a small green organism growing on a tree trunk in a Meghalaya cloud forest. ' +
        'How do you classify it?\n\n' +
        '| Question | If Yes | If No |\n' +
        '|---|---|---|\n' +
        '| Does it move? | Animalia | Keep going |\n' +
        '| Does it have roots, stems, leaves? | Plantae | Keep going |\n' +
        '| Is it green and photosynthetic? | Could be moss (Plantae) or lichen (Fungi+Algae) | Keep going |\n' +
        '| Does it have a crusty/leafy texture and grow flat on bark? | **Lichen** (Fungi + Algae partnership) | Likely moss (Plantae) |\n\n' +
        '**Surprising fact:** Lichens aren\'t a single organism — they\'re a partnership between a fungus ' +
        'and an alga (or cyanobacterium). They challenge our neat kingdom boundaries!\n\n' +
        '**NE India\'s unique species — found nowhere else:**\n\n' +
        '| Species | Location | Why It\'s Special |\n' +
        '|---|---|---|\n' +
        '| Pygmy hog | Manas, Assam | World\'s smallest pig (~25 cm tall) |\n' +
        '| Namdapha flying squirrel | Arunachal Pradesh | Known from a single specimen |\n' +
        '| Khasi Hills bent-toed gecko | Meghalaya | Discovered in 2018 |\n' +
        '| Purple frog relative | Meghalaya caves | New species found in 2022 |\n' +
        '| *Nepenthes khasiana* | Meghalaya | India\'s only pitcher plant |',
      intermediateContent:
        '**Biodiversity surveys — how scientists count species:**\n\n' +
        'Field biologists use standardised methods to survey biodiversity:\n\n' +
        '| Method | Used For | How It Works |\n' +
        '|---|---|---|\n' +
        '| Quadrat sampling | Plants, slow animals | Count everything in random square plots |\n' +
        '| Transect walks | Birds, large mammals | Walk a set path, record all sightings |\n' +
        '| Mist nets | Birds, bats | Fine nets capture flying animals temporarily |\n' +
        '| Camera traps | Elusive mammals | Motion-triggered cameras in the wild |\n' +
        '| Pitfall traps | Insects, small reptiles | Cups sunk into the ground |\n' +
        '| eDNA sampling | Aquatic species | Filter water, extract and sequence DNA |\n' +
        '| Acoustic monitoring | Birds, frogs, bats | Record calls, ID with software |\n\n' +
        '**Butterfly counting — a classification exercise:**\n\n' +
        'The Assamese butterfly count uses Pollard Walk methodology. Volunteers walk a fixed 1 km ' +
        'transect, recording every butterfly within 5 metres. Classification skills are essential — ' +
        'you must distinguish:\n\n' +
        '| Family | Wing Feature | NE India Example |\n' +
        '|---|---|---|\n' +
        '| Papilionidae (swallowtails) | Tail-like extensions on hindwings | Kaiser-i-Hind |\n' +
        '| Pieridae (whites/yellows) | White or yellow wings | Common emigrant |\n' +
        '| Nymphalidae (brush-footed) | Reduced front legs | Blue pansy |\n' +
        '| Lycaenidae (blues) | Small, underside spots | Gram blue |\n' +
        '| Hesperiidae (skippers) | Moth-like, fast flight | Indian skipper |\n\n' +
        'Namdapha National Park in Arunachal Pradesh has recorded 500+ butterfly species — ' +
        'more than many entire countries.',
      advancedContent:
        '**Species discovery — the frontier:**\n\n' +
        'NE India remains one of the most active regions for new species descriptions:\n\n' +
        '| Year Range | New Species Described (approx.) | Notable Finds |\n' +
        '|---|---|---|\n' +
        '| 2010-2015 | 50+ vertebrates | Multiple new frogs, lizards, snakes |\n' +
        '| 2015-2020 | 40+ vertebrates | New primate behaviour, cave-dwelling fish |\n' +
        '| 2020-2025 | 30+ vertebrates | Cave frogs, bent-toed geckos, new orchids |\n\n' +
        '**Integrative taxonomy** — the modern approach — combines:\n\n' +
        '1. **Morphology** — physical measurements and descriptions\n' +
        '2. **Molecular data** — DNA barcoding (COI, 16S) and multi-locus phylogenetics\n' +
        '3. **Ecology** — habitat preferences, elevation range, breeding behaviour\n' +
        '4. **Bioacoustics** — call analysis (critical for frogs and birds)\n' +
        '5. **Geometric morphometrics** — statistical shape analysis\n\n' +
        'A new frog species from Meghalaya typically requires:\n\n' +
        '| Evidence Type | What\'s Measured | Threshold for New Species |\n' +
        '|---|---|---|\n' +
        '| COI divergence | % genetic difference | >3% from nearest known species |\n' +
        '| Call analysis | Dominant frequency, pulse rate | Statistically distinct |\n' +
        '| Morphometrics | Snout-vent length, tympanum ratio | Non-overlapping ranges |\n' +
        '| Ecology | Elevation, microhabitat | Distinct niche |\n\n' +
        '**Conservation implications:**\n\n' +
        'Every new species discovery reshapes conservation priorities. When a "single widespread ' +
        'species" is split into multiple range-restricted species, each new species instantly becomes ' +
        'more threatened. This has happened repeatedly with NE Indian frogs — what was thought to be ' +
        'one common species across the region turned out to be 4-5 distinct species, each confined ' +
        'to a single mountain range.',
      diagram: 'FrogBiodiversityDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each survey method to its target',
          pairs: [
            ['Quadrat sampling', 'Plants and slow-moving organisms'],
            ['Mist nets', 'Birds and bats'],
            ['Camera traps', 'Elusive large mammals'],
            ['eDNA water sampling', 'Fish and aquatic species'],
            ['Acoustic monitoring', 'Frogs, birds, and bats by sound'],
            ['Pitfall traps', 'Ground insects and small reptiles'],
          ],
        },
      },
    },
  ],
};
