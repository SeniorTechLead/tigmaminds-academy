import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'molecular-biology',
  title: 'Molecular Biology & Protein Synthesis',
  category: 'biology',
  tags: ['chemistry'],
  keywords: ['DNA', 'RNA', 'transcription', 'translation', 'amino acid', 'ribosome', 'codon', 'protein folding'],
  icon: '🧬',
  tagline: 'From gene to protein — how cells read DNA instructions and build the machinery of life.',
  relatedStories: ['why-the-muga-silk-is-golden', 'eri-silk'],
  understand: [
    {
      title: 'DNA Replication',
      beginnerContent:
        'Watch the animation above. That yellow blob at the fork? It\'s **helicase** — a molecular motor that unzips the DNA double helix at 1,000 base pairs per second. Right behind it, **DNA polymerase** (the red proteins) reads each exposed strand and builds a new complementary strand, one base at a time. The result: two identical double helices from one.\n\n' +
        'This is happening in **every dividing cell in your body right now**, with near-perfect accuracy. The error rate is about **1 wrong base per billion** — like typing out *War and Peace* ten times and making a single letter mistake. How? Polymerase has a built-in proofreading mechanism: if it puts down the wrong base, it feels the mismatch, reverses, and corrects. Then a second team of repair enzymes sweeps behind looking for anything polymerase missed. Then *another* team catches damage from UV light and chemicals. Three layers of quality control to keep your DNA intact.\n\n' +
        'This process happens billions of times in your life. Every single cell you have — every gut lining cell, every skin cell, every immune cell that just divided — started with a helicase unzipping a helix and two polymerases getting to work.\n\n' +
        '**The four bases and their pairing rules:**\n\n' +
        '| Base | Pairs with | Memory trick |\n' +
        '|------|-----------|-------------|\n' +
        '| Adenine (A) | Thymine (T) | **A**pple-**T**ree |\n' +
        '| Thymine (T) | Adenine (A) | **T**ree-**A**pple |\n' +
        '| Cytosine (C) | Guanine (G) | **C**ar-**G**arage |\n' +
        '| Guanine (G) | Cytosine (C) | **G**arage-**C**ar |\n\n' +
        'Replication works like unzipping a jacket and making a mirror copy of each half:\n\n' +
        '1. **Helicase** (the unzipper) breaks the bonds between base pairs and pries the two strands apart\n' +
        '2. **Primase** lays down a short RNA starter (primer) — DNA polymerase needs a "running start"\n' +
        '3. **DNA polymerase** reads each exposed strand and builds a new matching strand, base by base\n' +
        '4. **DNA ligase** (the glue) seals any gaps\n\n' +
        'The result: two identical DNA molecules, each containing one original strand and one new strand. ' +
        'This is called **semiconservative replication** — each copy conserves half of the original.\n\n' +
        '**How accurate is the copy?**\n\n' +
        '| Stage | Error rate |\n' +
        '|-------|----------|\n' +
        '| Initial base selection by polymerase | 1 error per 100,000 bases |\n' +
        '| After proofreading (polymerase checks its own work) | 1 error per 10,000,000 bases |\n' +
        '| After mismatch repair enzymes patrol | 1 error per 1,000,000,000 bases |\n\n' +
        'That final error rate means roughly **3 mistakes** across the entire 3.2 billion base-pair human genome per cell division — like copying 800 copies of the Mahabharata and making only 3 typos total.',
      intermediateContent:
        '**Replication fork machinery in detail:**\n\n' +
        'The replication fork is a Y-shaped structure where the DNA is being actively unwound and copied. ' +
        'DNA polymerase can only build new DNA in the **5\' to 3\' direction**, which creates an asymmetry:\n\n' +
        '| Strand | Direction | How it\'s made | Named after |\n' +
        '|--------|----------|--------------|------------|\n' +
        '| Leading strand | Same as fork movement | Continuous synthesis | Leads the way |\n' +
        '| Lagging strand | Opposite to fork movement | Short fragments joined later | Lags behind |\n\n' +
        'The lagging strand is built in **Okazaki fragments** (~100-200 nucleotides in eukaryotes, ~1,000-2,000 in bacteria), each starting from its own RNA primer. DNA ligase then seals the fragments into a continuous strand.\n\n' +
        '**Replication speed and origins:**\n\n' +
        '| Organism | Fork speed | Origins per genome | Time to replicate |\n' +
        '|----------|-----------|-------------------|------------------|\n' +
        '| E. coli | ~1,000 nt/sec | 1 | ~40 minutes |\n' +
        '| Human cell | ~50 nt/sec | ~30,000-50,000 | ~8 hours |\n\n' +
        'A single origin at human speed would take ~18 hours. The solution: fire **thousands of origins** simultaneously. ' +
        'Early in S-phase, euchromatin (loosely packed, gene-rich) replicates first; late S-phase handles heterochromatin (tightly packed, gene-poor).\n\n' +
        '**The enzyme toolkit:**\n\n' +
        '| Enzyme | Function | Energy cost |\n' +
        '|--------|---------|------------|\n' +
        '| Helicase (DnaB in E. coli) | Unwinds dsDNA | 2 ATP per bp separated |\n' +
        '| SSB proteins | Coat ssDNA to prevent re-annealing | None (binding alone) |\n' +
        '| Topoisomerase | Relieves supercoiling ahead of fork | ATP (type II) |\n' +
        '| Primase | Synthesises ~10 nt RNA primers | NTPs |\n' +
        '| DNA Pol III (E. coli) | Main replicase, processivity ~100,000 nt | dNTPs |\n' +
        '| DNA ligase | Seals nicks between Okazaki fragments | NAD⁺ (bacteria) or ATP (eukaryotes) |',
      advancedContent:
        '**The replisome — a molecular machine of ~15 coordinated proteins:**\n\n' +
        'In E. coli, the DnaB helicase forms a **hexameric ring** encircling the lagging-strand template, translocating 5\'→3\'. ' +
        'The Pol III holoenzyme (3 core polymerases + clamp loader + sliding clamps) synthesises both strands simultaneously.\n\n' +
        '**The trombone model** explains lagging-strand synthesis: the lagging-strand template loops back so that Pol III synthesises in the same direction as fork movement, releasing each completed Okazaki fragment via clamp recycling (~every 2 seconds).\n\n' +
        '**Replication stress and cancer:**\n\n' +
        '| Problem | Consequence | Repair pathway |\n' +
        '|---------|-----------|---------------|\n' +
        '| Stalled fork (e.g., DNA lesion) | ssDNA gap coated by RPA | ATR-CHK1 stabilises fork |\n' +
        '| Collapsed fork (DSB) | Chromosome breakage | Homologous recombination |\n' +
        '| Under-replicated DNA at mitosis | Ultrafine anaphase bridges | MUS81 nuclease, BLM helicase |\n' +
        '| Oncogene-induced replication stress | Premature origin firing, fork stalling | p53 checkpoint (often lost in cancer) |\n\n' +
        '**DNA damage tolerance** bypasses lesions without repairing them:\n\n' +
        '- **Translesion synthesis (TLS):** Specialised low-fidelity polymerases (Pol η, Pol ζ, Pol κ) replicate past lesions. ' +
        'Pol η accurately bypasses UV-induced thymine dimers — loss of Pol η causes xeroderma pigmentosum variant (XP-V), extreme sun sensitivity.\n' +
        '- **Template switching:** Uses the sister chromatid as an error-free template to bypass the lesion.\n\n' +
        '**Worked example — replication time calculation:**\n\n' +
        'Human genome = 3.2 × 10⁹ bp. Fork speed = 50 nt/sec. Each origin fires bidirectionally (2 forks).\n' +
        'With 40,000 origins: each origin replicates 3.2 × 10⁹ / 40,000 = 80,000 bp. ' +
        'Two forks cover 80,000 bp at 100 nt/sec combined → 800 seconds ≈ **13 minutes per origin**. ' +
        'But origins fire in a staggered programme over ~8 hours, not all at once — early and late replication timing is epigenetically controlled.',
      diagram: 'DNAReplicationDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each replication enzyme to its function',
          pairs: [
            ['Helicase', 'Unwinds the double helix'],
            ['Primase', 'Lays down RNA primers'],
            ['DNA polymerase III', 'Builds the new DNA strand'],
            ['DNA ligase', 'Seals gaps between Okazaki fragments'],
            ['Topoisomerase', 'Relieves supercoiling ahead of the fork'],
            ['SSB proteins', 'Prevent single strands from re-annealing'],
          ],
        },
      },
    },
    {
      title: 'Transcription',
      beginnerContent:
        'Watch the red machine above sliding along the DNA. That\'s **RNA polymerase**, and what it\'s doing is transcription — reading one strand of DNA and writing a complementary mRNA copy. Notice the green strand forming behind it, peeling off into the cytoplasm. That\'s the messenger.\n\n' +
        'Here\'s why it matters: **DNA never leaves the nucleus.** Your genome is too precious to let it wander around the cell getting damaged. Instead, when a protein is needed, the cell sends RNA polymerase to the right gene, makes a working copy, and sends that copy out through the nuclear pores. The original stays safe, locked in the vault.\n\n' +
        'The pairing rules are almost the same as DNA — but **RNA uses U (uracil) instead of T**. So when a DNA template reads "A", the mRNA gets "U" instead of "T". Everything else (G-C, C-G, T-A) stays the same.\n\n' +
        'At full speed, RNA polymerase reads **80 bases per second** — it would finish copying an average gene in about 30 seconds. At any given moment, thousands of RNA polymerases are working simultaneously on different genes across your nucleus.\n\n' +
        '**The three stages of transcription:**\n\n' +
        '| Stage | What happens | Analogy |\n' +
        '|-------|-------------|--------|\n' +
        '| **Initiation** | RNA polymerase binds to the promoter (a "start here" sign) | Finding the right page in the cookbook |\n' +
        '| **Elongation** | RNA polymerase reads DNA and builds mRNA, base by base | Copying the recipe onto a notecard |\n' +
        '| **Termination** | RNA polymerase hits a stop signal and releases the mRNA | Reaching "END OF RECIPE" |\n\n' +
        '**RNA base pairing — one key difference from DNA:**\n\n' +
        '| DNA template base | RNA base added | Note |\n' +
        '|------------------|---------------|------|\n' +
        '| A | U (uracil) | RNA uses U instead of T |\n' +
        '| T | A | |\n' +
        '| C | G | Same as DNA |\n' +
        '| G | C | Same as DNA |\n\n' +
        'After the mRNA is made, it gets **three modifications** before leaving the nucleus:\n\n' +
        '1. **5\' cap** — a modified guanine "helmet" protects the front end\n' +
        '2. **Poly-A tail** — a string of ~200 adenines added to the back end for stability\n' +
        '3. **Splicing** — non-coding segments (introns) are cut out; coding segments (exons) are joined together\n\n' +
        'Think of introns as random paragraphs of nonsense inserted throughout the recipe. ' +
        'The spliceosome (a molecular machine) carefully removes them and stitches the useful instructions back together. ' +
        'The mature mRNA then exits through nuclear pores to the ribosome — the cell\'s protein-building factory.',
      intermediateContent:
        '**RNA Polymerase II and the transcription machinery:**\n\n' +
        'Eukaryotic transcription requires a team of **general transcription factors** (GTFs) that assemble at the promoter before Pol II can begin:\n\n' +
        '| Factor | Role |\n' +
        '|--------|-----|\n' +
        '| TFIID (contains TBP) | Recognises TATA box (~30 bp upstream), bends DNA ~80° |\n' +
        '| TFIIA | Stabilises TBP-DNA binding |\n' +
        '| TFIIB | Positions Pol II at the start site |\n' +
        '| TFIIF | Escorts Pol II to the promoter |\n' +
        '| TFIIE | Recruits TFIIH |\n' +
        '| TFIIH | Helicase + kinase: unwinds ~10 bp DNA, phosphorylates Pol II CTD |\n\n' +
        '**The CTD (C-terminal domain) code:**\n\n' +
        'Pol II\'s CTD contains **52 repeats** of the sequence YSPTSPS. Phosphorylation of specific serines acts as a switch:\n\n' +
        '| Modification | Stage | What it recruits |\n' +
        '|-------------|-------|------------------|\n' +
        '| Ser5 phosphorylation | Initiation → early elongation | Capping enzymes |\n' +
        '| Ser2 phosphorylation | Late elongation → termination | Splicing & polyadenylation factors |\n\n' +
        '**Splicing mechanism — two transesterification reactions:**\n\n' +
        '1. The 2\'-OH of the **branch-point adenine** attacks the 5\' splice site → forms a lariat (lasso-shaped intermediate)\n' +
        '2. The free 3\'-OH of exon 1 attacks the 3\' splice site → exons joined, lariat released\n\n' +
        'The spliceosome (U1, U2, U4, U5, U6 snRNPs + ~200 proteins) catalyses this with **~99.99% accuracy**. ' +
        'Errors cause disease — mutations at splice sites account for ~15% of all genetic diseases.',
      advancedContent:
        '**Alternative splicing — one gene, many proteins:**\n\n' +
        'About **95% of human multi-exon genes** undergo alternative splicing, vastly expanding protein diversity.\n\n' +
        '| Gene | Organism | Possible mRNA variants | Significance |\n' +
        '|------|---------|----------------------|-------------|\n' +
        '| DSCAM | Drosophila | 38,016 | More variants than total Drosophila genes |\n' +
        '| Neurexin-3 | Human | >1,000 | Synapse specificity in the brain |\n' +
        '| Troponin T | Human | 64 | Heart vs skeletal muscle isoforms |\n' +
        '| Calcitonin/CGRP | Human | 2 | Thyroid (calcitonin) vs neuron (CGRP) |\n\n' +
        'Splice site selection is regulated by **cis-regulatory elements**:\n\n' +
        '| Element | Location | Binding protein | Effect |\n' +
        '|---------|---------|----------------|--------|\n' +
        '| ESE (exonic splicing enhancer) | Within exon | SR proteins | Promotes exon inclusion |\n' +
        '| ESS (exonic splicing silencer) | Within exon | hnRNP proteins | Promotes exon skipping |\n' +
        '| ISE (intronic splicing enhancer) | Within intron | SR proteins | Enhances nearby splice site |\n' +
        '| ISS (intronic splicing silencer) | Within intron | hnRNP proteins | Suppresses nearby splice site |\n\n' +
        '**Pervasive transcription and lncRNAs:**\n\n' +
        'RNA-seq has revealed that >75% of the human genome is transcribed, including thousands of **long non-coding RNAs** (lncRNAs). ' +
        'The lncRNA **XIST** (17 kb) coats one X chromosome in female mammals, recruiting PRC2 (Polycomb repressive complex 2) to ' +
        'silence ~1,000 genes via H3K27 trimethylation — this is **X-inactivation**, the reason calico cats have patchy fur.\n\n' +
        '**Worked example — calculating coding sequence from gene structure:**\n\n' +
        'The human β-globin gene spans 1,606 bp but contains 3 exons and 2 introns:\n' +
        'Exon 1: 142 bp + Exon 2: 223 bp + Exon 3: 261 bp = **626 bp** of coding sequence.\n' +
        'Intron 1: 130 bp + Intron 2: 850 bp = 980 bp removed by splicing.\n' +
        'The mature mRNA codes for 626/3 = ~208 codons → a **147-amino-acid** protein (subtracting start/stop signals). ' +
        'Over 60% of the gene is discarded as introns.',
      diagram: 'TranscriptionDiagram',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            {
              text: 'RNA polymerase reads the template strand in the 5\' to 3\' direction.',
              answer: false,
              explanation: 'RNA polymerase reads the template strand 3\' to 5\' and builds the mRNA 5\' to 3\'.',
            },
            {
              text: 'Introns are non-coding sequences that are removed during splicing.',
              answer: true,
              explanation: 'Correct — introns are spliced out by the spliceosome, and the remaining exons are joined.',
            },
            {
              text: 'The poly-A tail is added to the 5\' end of mRNA.',
              answer: false,
              explanation: 'The poly-A tail is added to the 3\' end. The 5\' end gets a modified guanine cap.',
            },
            {
              text: 'One human gene can produce only one type of mRNA.',
              answer: false,
              explanation: 'About 95% of multi-exon human genes undergo alternative splicing, producing multiple mRNA variants from one gene.',
            },
            {
              text: 'RNA uses uracil (U) instead of thymine (T).',
              answer: true,
              explanation: 'Correct — where DNA has thymine, RNA has uracil. Both pair with adenine.',
            },
          ],
        },
      },
    },
    {
      title: 'Translation',
      beginnerContent:
        'Watch the ribosome above slide along the mRNA. At every 3-base stretch (a **codon**), a tRNA floats down carrying a specific amino acid. The tRNA\'s anticodon pairs with the codon; the amino acid gets snapped onto the growing protein chain; the ribosome shifts forward by 3 bases; repeat. In a typical human cell, a ribosome adds **about 6 amino acids per second** to a growing protein. By the time you finish this sentence, millions of new proteins have been assembled inside you.\n\n' +
        'This is where DNA actually becomes *stuff that does things*. The protein that just came off the ribosome might be an enzyme that digests your lunch, a muscle fibre that contracts when you move, an antibody that hunts viruses, or a receptor that lets one of your neurons hear another. Every function your body performs started as a sequence of A, U, G, C being read, three letters at a time, at a ribosome.\n\n' +
        'Your cells contain millions of ribosomes. Each one is itself built of RNA and proteins — and the "core" that catalyses the peptide bonds between amino acids is made of RNA, not protein. This is a deep clue: RNA can both **carry information** (like DNA) AND **do chemistry** (like an enzyme). Some biologists believe life originated as self-replicating RNA molecules, billions of years before DNA or proteins existed — the "RNA world" hypothesis.\n\n' +
        '**The cast of characters:**\n\n' +
        '| Player | Role | Analogy |\n' +
        '|--------|-----|--------|\n' +
        '| mRNA | Carries the coded instructions | Recipe card |\n' +
        '| Ribosome | Reads mRNA and assembles the protein | The cook |\n' +
        '| tRNA | Delivers the correct amino acid to the ribosome | Ingredient delivery service |\n' +
        '| Amino acids | Building blocks of the protein (20 types) | Ingredients |\n\n' +
        'The mRNA is read in groups of **three bases** called **codons**. Each codon specifies one amino acid. ' +
        'For example, AUG = methionine, UUU = phenylalanine, GCA = alanine.\n\n' +
        '**The three stages of translation:**\n\n' +
        '| Stage | What happens |\n' +
        '|-------|-------------|\n' +
        '| **Initiation** | Small ribosomal subunit finds the start codon (AUG). Initiator tRNA carrying methionine binds. Large subunit joins. |\n' +
        '| **Elongation** | Ribosome reads codons one at a time. Matching tRNAs bring amino acids. Peptide bonds form between them. Ribosome shifts forward. |\n' +
        '| **Termination** | Ribosome hits a stop codon (UAA, UAG, or UGA). Release factors trigger release of the finished protein chain. |\n\n' +
        '**Speed:** Ribosomes add about **15-20 amino acids per second** in eukaryotes. A typical 300-amino-acid protein takes ~15-20 seconds.\n\n' +
        'Multiple ribosomes can read the same mRNA simultaneously, forming a **polysome** — like multiple cooks reading copies of the same recipe. ' +
        'In the silk glands of the *Antheraea assamensis* moth (the Muga silkworm of Assam), ' +
        'polysomes with up to **80 ribosomes** translate fibroin mRNA thousands of times to produce the vast quantities of silk protein needed for a single cocoon. ' +
        'This is why Muga silk production requires such metabolically active gland cells.',
      intermediateContent:
        '**The ribosome\'s three tRNA binding sites:**\n\n' +
        '| Site | Name | Function |\n' +
        '|------|------|----------|\n' +
        '| A site | Aminoacyl | Incoming charged tRNA binds here |\n' +
        '| P site | Peptidyl | Holds tRNA attached to the growing chain |\n' +
        '| E site | Exit | Empty tRNA leaves here |\n\n' +
        '**The elongation cycle step by step:**\n\n' +
        '1. Charged tRNA enters A site (codon-anticodon matching, checked by the ribosome)\n' +
        '2. **Peptide bond forms** between P-site amino acid and A-site amino acid\n' +
        '3. Ribosome **translocates** one codon forward (requires EF-G + GTP hydrolysis)\n' +
        '4. Empty tRNA moves P → E → exits. Growing chain moves A → P. New codon exposed at A site.\n' +
        '5. Repeat.\n\n' +
        '**The ribosome is a ribozyme:**\n\n' +
        'The peptide bond is catalysed by the **23S rRNA** of the large subunit — not by any protein. ' +
        'The nearest protein is >18 Angstroms away from the catalytic centre. This supports the **RNA world hypothesis**: ' +
        'early life likely used RNA for both information storage and catalysis, before DNA and proteins evolved.\n\n' +
        '**Aminoacyl-tRNA synthetases — the translators:**\n\n' +
        '| Property | Detail |\n' +
        '|----------|-------|\n' +
        '| Number | 20 (one per amino acid) |\n' +
        '| Job | "Charge" each tRNA with the correct amino acid |\n' +
        '| Accuracy mechanism | Double-sieve: active site rejects large amino acids; editing site hydrolyses small wrong ones |\n' +
        '| Error rate | ~1 wrong amino acid per 10,000 incorporations |\n\n' +
        '**Comparative translation speeds:**\n\n' +
        '| Organism | Speed (amino acids/sec) | 300-aa protein time |\n' +
        '|----------|------------------------|--------------------|\n' +
        '| Bacteria (E. coli) | ~20 | ~15 seconds |\n' +
        '| Eukaryotes (human) | ~6 | ~50 seconds |\n' +
        '| Muga silk gland polysome | ~6 per ribosome × 80 ribosomes | 1 fibroin chain every ~2.5 min |',
      advancedContent:
        '**Atomic structure of the ribosome (2009 Nobel Prize: Ramakrishnan, Steitz, Yonath):**\n\n' +
        'X-ray crystallography at atomic resolution revealed the **peptidyl transferase centre** — a pocket formed entirely of 23S rRNA. ' +
        'The catalytic mechanism involves **substrate-assisted catalysis**: the 2\'-OH of the P-site tRNA\'s A76 ribose positions the ' +
        'alpha-amino group of the A-site aminoacyl-tRNA for nucleophilic attack on the ester carbonyl of the peptidyl-tRNA.\n\n' +
        '**Translational regulation — fast control without new transcription:**\n\n' +
        '| Mechanism | How it works | Scale of regulation |\n' +
        '|-----------|------------|--------------------|\n' +
        '| miRNA (via RISC/Argonaute) | ~22 nt RNA binds 3\'-UTR of target mRNA | >60% of human genes are predicted targets |\n' +
        '| Upstream ORFs (uORFs) | Small ORFs in 5\'-UTR compete with main ORF | ~50% of human mRNAs have uORFs |\n' +
        '| IRES elements | Internal ribosome entry bypasses cap-dependent initiation | Active during stress when cap-dependent translation is shut down |\n' +
        '| mTOR pathway | Phosphorylates 4E-BP, releasing eIF4E for cap-dependent translation | Master growth/nutrient sensor |\n\n' +
        '**Ribosome profiling (Ribo-seq) — a snapshot of the translational landscape:**\n\n' +
        'The technique captures ribosome-protected mRNA fragments (~28 nt) genome-wide, revealing:\n' +
        '- Which mRNAs are being actively translated\n' +
        '- Translation rate at each codon\n' +
        '- Where ribosomes pause (rare codons, signal peptides, mRNA secondary structures)\n' +
        '- Previously unknown translated ORFs in "non-coding" regions\n\n' +
        '**Worked example — polysome output calculation:**\n\n' +
        'Muga silk fibroin heavy chain: ~2,600 amino acids. At 6 aa/sec per ribosome: one chain takes 2,600/6 = **433 seconds (~7.2 minutes)**. ' +
        'With 80 ribosomes per mRNA spaced ~80 codons apart, a new ribosome initiates every 80/6 = **13.3 seconds**. ' +
        'Steady-state output: one completed fibroin chain every ~13.3 seconds per mRNA molecule. ' +
        'With thousands of fibroin mRNA copies per silk gland cell, the gland produces milligrams of protein per hour — ' +
        'enough to spin the entire cocoon in about 3-4 days.',
      diagram: 'TranslationDiagram',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each translation component to its role',
          pairs: [
            ['mRNA', 'Carries coded instructions from nucleus'],
            ['tRNA', 'Delivers amino acids to the ribosome'],
            ['Ribosome', 'Reads codons and catalyses peptide bonds'],
            ['Start codon (AUG)', 'Signals the beginning of translation'],
            ['Stop codon (UAA/UAG/UGA)', 'Signals the end of translation'],
            ['Release factors', 'Enter A site at stop codon and trigger chain release'],
          ],
        },
      },
    },
    {
      title: 'The Genetic Code',
      beginnerContent:
        'Try the codon decoder above. Pick three bases — any three — and see which amino acid they code for. Notice something? Try AAA, AAG, AGA, AGG: all four give you different amino acids. Now try GGU, GGC, GGA, GGG: all four give you Glycine. **The code is redundant.** Most amino acids have multiple codons — a built-in error correction. Change the third base and there\'s a good chance the protein is unaffected.\n\n' +
        'And here is the stunning fact: **every living organism on Earth uses the same codon table.** A bacterium reading AUG makes Methionine. A blue whale reading AUG makes Methionine. You reading AUG make Methionine. A virus, a mushroom, a pine tree, an octopus — same code.\n\n' +
        'This isn\'t coincidence. It\'s evidence of a single common ancestor. Every living thing descends from one primitive cell 3.8 billion years ago, and somehow that cell\'s DNA-to-protein decoding rules got locked in and kept. No organism has ever meaningfully diverged from it. (The tiny exceptions — a handful of codons reassigned in mitochondria and certain protists — only emphasise how universal the rest is.)\n\n' +
        'With 4 bases in each of 3 positions = 4³ = **64 possible codons**. 61 code for amino acids, 3 say "STOP," and 1 (AUG) says "START, and code for Methionine."\n\n' +
        '| Codon type | Count | Purpose |\n' +
        '|-----------|-------|--------|\n' +
        '| Sense codons | 61 | Each codes for one of 20 amino acids |\n' +
        '| Stop codons (UAA, UAG, UGA) | 3 | Signal "end of protein" |\n' +
        '| Start codon (AUG) | 1 (also a sense codon) | Signal "begin here" + codes for methionine |\n\n' +
        '**Why 64 codons for only 20 amino acids?**\n\n' +
        'The code is **redundant** (also called degenerate) — multiple codons can code for the same amino acid. ' +
        'This is actually a safety feature.\n\n' +
        '**Example — leucine has 6 codons:**\n\n' +
        '| Codon | Amino acid |\n' +
        '|-------|----------|\n' +
        '| UUA | Leucine |\n' +
        '| UUG | Leucine |\n' +
        '| CUU | Leucine |\n' +
        '| CUC | Leucine |\n' +
        '| CUA | Leucine |\n' +
        '| CUG | Leucine |\n\n' +
        'Notice that the first two positions are similar, and the variation is mainly in the **third position** (the "wobble" position). ' +
        'A mutation at the third position often produces the same amino acid — so the protein is unharmed. ' +
        'This built-in error tolerance protects organisms from the damaging effects of random mutations.\n\n' +
        '**The code is (nearly) universal:**\n\n' +
        'Bacteria, rice plants, elephants, and humans all use essentially the same codon table. ' +
        'A tea plant in an Assam garden uses the same AUG → methionine rule as the one-horned rhino in Kaziranga. ' +
        'This universality is powerful evidence that all life on Earth shares a **common ancestor**.',
      intermediateContent:
        '**Wobble base pairing — why fewer tRNAs than codons are needed:**\n\n' +
        'Crick\'s **wobble hypothesis** (1966): the first base of the anticodon (position 34) can form non-standard pairs ' +
        'with the third base of the codon.\n\n' +
        '| Anticodon base (position 34) | Can pair with codon base (position 3) |\n' +
        '|-----------------------------|--------------------------------------|\n' +
        '| U | A, G |\n' +
        '| C | G only |\n' +
        '| A | U only |\n' +
        '| G | U, C |\n' +
        '| Inosine (I) | U, C, A |\n\n' +
        'This means humans need only **~45 different tRNA anticodon types** to read all 61 sense codons.\n\n' +
        '**The code minimises mutation damage — and we can prove it:**\n\n' +
        'A mathematical analysis (Freeland & Hurst, 1998) compared the standard genetic code to **1 million randomly generated codes**. ' +
        'They measured how much a single-nucleotide mutation changes the physical properties of the resulting amino acid. Result: ' +
        'the standard code minimises mutation impact better than **>99.99%** of random codes.\n\n' +
        '| Mutation position | Effect on amino acid |\n' +
        '|------------------|--------------------|\n' +
        '| 1st position | Usually changes amino acid, but often to a chemically similar one |\n' +
        '| 2nd position | Almost always changes amino acid |\n' +
        '| 3rd position (wobble) | Often **silent** — same amino acid |\n\n' +
        '**Stop codon nicknames** (from the history of genetics):\n\n' +
        '| Codon | Nickname | Origin |\n' +
        '|-------|---------|--------|\n' +
        '| UAA | Ochre | Named after an amber mutant modifier |\n' +
        '| UAG | Amber | First stop codon discovered, named by its discoverer |\n' +
        '| UGA | Opal | Continuing the gemstone theme |',
      advancedContent:
        '**Exceptions to the "universal" code:**\n\n' +
        '| Organism/system | Codon | Standard meaning | Reassigned meaning |\n' +
        '|----------------|-------|-----------------|-------------------|\n' +
        '| Human mitochondria | UGA | Stop | Tryptophan |\n' +
        '| Human mitochondria | AGA/AGG | Arginine | Stop |\n' +
        '| Human mitochondria | AUA | Isoleucine | Methionine |\n' +
        '| Mycoplasma | UGA | Stop | Tryptophan |\n' +
        '| Candida (yeast) | CUG | Leucine | Serine |\n' +
        '| Ciliated protozoa | UAA/UAG | Stop | Glutamine |\n\n' +
        'These deviations arose in small genomes where **genetic drift** can fix codon reassignments — ' +
        'the "codon capture" or "ambiguous intermediate" models explain the transition.\n\n' +
        '**Expanding the genetic code — synthetic biology frontier:**\n\n' +
        'Chin\'s lab (MRC, Cambridge) engineered E. coli with a **compressed genome** — synonymous codons removed, freeing codons for reassignment ' +
        'to **non-canonical amino acids (ncAAs)**.\n\n' +
        '| Advance | Detail |\n' +
        '|---------|-------|\n' +
        '| ncAAs incorporated to date | >200 (photo-crosslinkers, click-chemistry handles, fluorescent probes) |\n' +
        '| Method | Orthogonal suppressor tRNA + engineered aminoacyl-tRNA synthetase |\n' +
        '| Nobel Prize connection | Frances Arnold (2018) — directed evolution of enzymes, including synthetases |\n' +
        '| Application | Proteins with photo-activatable crosslinks, site-specific fluorescent labels, non-hydrolysable bonds |\n\n' +
        '**Worked example — counting synonymous vs non-synonymous mutations:**\n\n' +
        'Consider the codon GCU (alanine). There are 9 possible single-nucleotide changes (3 positions × 3 alternative bases):\n' +
        '- Position 1: ACU(Thr), UCU(Ser), CCU(Pro) — all change amino acid → 3 non-synonymous\n' +
        '- Position 2: GAU(Asp), GUU(Val), GGU(Gly) — all change amino acid → 3 non-synonymous\n' +
        '- Position 3: GCC(Ala), GCA(Ala), GCG(Ala) — all still alanine → **3 synonymous**\n\n' +
        'So 3/9 = **33% of single-nucleotide mutations in GCU are silent**. ' +
        'This wobble-position buffering is why the genetic code is so robust against random mutation.',
      diagram: 'CodonTableDiagram',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'The genetic code is so well-optimised that it outperforms 99.99% of randomly generated codes at minimising mutation damage.',
            'Human mitochondria use a slightly different genetic code — UGA means tryptophan instead of stop.',
            'The codon AUG does double duty: it codes for methionine AND signals "start translating here."',
            'Scientists have expanded the genetic code to include over 200 non-natural amino acids, creating proteins with properties impossible in nature.',
            'A tea plant in Assam and a one-horned rhino in Kaziranga use the exact same genetic code — evidence of a common ancestor billions of years ago.',
            'The stop codon UAG is called "amber" because the grad student who discovered it had the last name Bernstein — German for "amber."',
          ],
        },
      },
    },
    {
      title: 'Gene Expression & Epigenetics',
      beginnerContent:
        'Here\'s a puzzle. A liver cell, a skin cell, a neuron, and a sperm cell all have **exactly the same DNA**. So how can they be so radically different? One makes bile. One grows hair. One fires action potentials. One swims with a tail. If they all have the same instruction manual, why don\'t they all do the same thing?\n\n' +
        'Because they read **different pages.** Every cell carries all 20,000 of your genes. But at any given moment, each cell type is only *expressing* a small subset — maybe 10,000-15,000 of them — and permanently silencing the rest. A liver cell\'s DNA contains the blueprint for making hair, but that gene has been shut off. A skin cell carries the blueprint for insulin, but it\'s silenced too.\n\n' +
        '**This is what differentiation is.** During embryonic development, the same fertilized egg gives rise to neurons, bones, muscles, blood — not by giving each cell type a different genome, but by switching different genes on and off. Once a cell commits to being a liver cell, those settings are (mostly) permanent.\n\n' +
        '**Epigenetics** — the "above-genetics" layer — is how these on/off switches work:\n\n' +
        '| Cell type | Key genes expressed | Genes silenced |\n' +
        '|-----------|-------------------|---------------|\n' +
        '| Red blood cell precursor | Hemoglobin (carries oxygen) | Keratin, insulin |\n' +
        '| Skin cell | Keratin (structural protein) | Hemoglobin, insulin |\n' +
        '| Pancreatic beta cell | Insulin (regulates blood sugar) | Hemoglobin, keratin |\n' +
        '| Muga silk gland cell | Fibroin & sericin (silk proteins) | Hemoglobin, keratin |\n\n' +
        'Each cell type uses only about **20-30%** of its genes at any given time. The rest are switched off.\n\n' +
        '**Two levels of gene control:**\n\n' +
        '**Level 1 — Transcription factors (the switches):**\n' +
        'Proteins that bind to specific DNA sequences near a gene\'s promoter, acting as ON/OFF switches. ' +
        '**Activators** boost transcription; **repressors** block it. Enhancer sequences (sometimes thousands of bases away) ' +
        'loop around to contact the promoter, like someone on the far side of a room reaching over to flip a light switch.\n\n' +
        '**Level 2 — Epigenetics (the dimmer knobs):**\n' +
        'Changes that affect gene expression **without altering the DNA sequence itself**. Two main mechanisms:\n\n' +
        '| Mechanism | What it does | Effect |\n' +
        '|-----------|------------|--------|\n' +
        '| DNA methylation | Adds -CH₃ groups to cytosine bases | Usually **silences** the gene |\n' +
        '| Histone modification | Adds chemical tags to histone protein spools | Loosens (activates) or tightens (silences) DNA packing |\n\n' +
        'Think of DNA as thread wound around spools (histones). **Tightly wound** = gene buried and inaccessible (heterochromatin). ' +
        '**Loosely wound** = gene exposed and ready to be read (euchromatin).\n\n' +
        'Remarkably, some epigenetic marks can be influenced by **environment** — diet, stress, toxin exposure — ' +
        'and in some cases passed to the next generation. Your experiences can literally change how your genes are read.',
      intermediateContent:
        '**Multi-level gene regulation:**\n\n' +
        '| Level | Mechanism | Speed | Example |\n' +
        '|-------|----------|-------|---------|\n' +
        '| Transcriptional | TF binding, chromatin remodelling | Minutes to hours | Lac operon (E. coli) |\n' +
        '| Post-transcriptional | mRNA stability, miRNA silencing | Minutes | Iron response elements (IRE) |\n' +
        '| Translational | Ribosome loading, uORF competition | Seconds to minutes | Ferritin mRNA |\n' +
        '| Post-translational | Protein folding, modification, degradation | Seconds | Ubiquitin-proteasome system |\n\n' +
        '**The lac operon — the first gene circuit ever described (Jacob & Monod, 1961 Nobel Prize):**\n\n' +
        'In E. coli, three genes for lactose digestion are controlled as a unit:\n' +
        '- **No lactose present:** Lac repressor binds the operator, physically blocking RNA polymerase → genes OFF\n' +
        '- **Lactose present:** Allolactose (a lactose derivative) binds the repressor, changing its shape → repressor falls off → genes ON\n' +
        '- **Glucose also present:** CAP-cAMP activator is inactive → genes stay mostly OFF (why waste energy on lactose when glucose is available?)\n\n' +
        '**Histone code — the language of chemical tags:**\n\n' +
        '| Modification | Enzyme | Effect on transcription |\n' +
        '|-------------|--------|------------------------|\n' +
        '| H3K4me3 (trimethylation of lysine 4) | SET1/MLL | **Activation** |\n' +
        '| H3K27me3 (trimethylation of lysine 27) | PRC2 (EZH2) | **Silencing** |\n' +
        '| H3 acetylation | HATs (histone acetyltransferases) | **Activation** (loosens chromatin) |\n' +
        '| H3 deacetylation | HDACs (histone deacetylases) | **Silencing** (tightens chromatin) |\n\n' +
        '**DNA methylation and CpG islands:**\n\n' +
        'About **70% of human gene promoters** sit within CpG islands (clusters of CpG dinucleotides). ' +
        'Methylation of these islands recruits methyl-CpG-binding proteins → attract HDAC complexes → chromatin compaction → gene silence. ' +
        'The maintenance methyltransferase **DNMT1** copies methylation patterns to daughter strands after replication, ' +
        'ensuring that a liver cell\'s daughter cells remain liver cells.',
      advancedContent:
        '**Epigenetic reprogramming — erasing and rewriting the marks:**\n\n' +
        'Two major reprogramming events reset epigenetic marks:\n\n' +
        '| Event | When | Mechanism | Purpose |\n' +
        '|-------|-----|----------|--------|\n' +
        '| In primordial germ cells (PGCs) | Embryonic development | Near-complete erasure of methylation | Reset for sex-specific imprinting |\n' +
        '| After fertilisation | Zygote → blastocyst | Paternal genome: active demethylation (TET enzymes); Maternal: passive demethylation | Return to totipotency |\n\n' +
        '**TET enzyme pathway:** 5mC → 5hmC → 5fC → 5caC → base excision repair → unmodified C\n\n' +
        '**Genomic imprinting — parent-of-origin gene expression:**\n\n' +
        'About ~150 genes are expressed from only the maternal or paternal copy:\n\n' +
        '| Gene | Expressed from | Function | Disease if disrupted |\n' +
        '|------|---------------|---------|---------------------|\n' +
        '| IGF2 | Paternal | Growth factor | Beckwith-Wiedemann syndrome |\n' +
        '| H19 | Maternal | lncRNA, growth suppressor | Silver-Russell syndrome |\n' +
        '| UBE3A | Maternal (in brain) | Ubiquitin ligase | Angelman syndrome |\n' +
        '| SNRPN | Paternal | Splicing factor | Prader-Willi syndrome |\n\n' +
        '**Transgenerational epigenetic inheritance:**\n\n' +
        'Dias & Ressler (2014): Male mice conditioned to fear the odorant acetophenone (paired with foot shock) passed ' +
        'epigenetic marks — demethylation of the Olfr151 gene promoter — to F1 and F2 offspring. ' +
        'These offspring showed enhanced startle responses to acetophenone **despite never being conditioned themselves**.\n\n' +
        '**Worked example — predicting gene silencing from epigenetic marks:**\n\n' +
        'A gene\'s promoter shows: CpG island with 85% methylation + H3K27me3 + no H3 acetylation.\n' +
        'Prediction: gene is **silenced**. All three marks point to heterochromatin.\n' +
        'If you treated this cell with a DNMT inhibitor (5-azacytidine) + an HDAC inhibitor (SAHA), ' +
        'methylation would drop and acetylation would increase → chromatin loosens → gene reactivated.\n' +
        'This is the basis of **epigenetic cancer therapy** — several DNMT and HDAC inhibitors are FDA-approved ' +
        'for myelodysplastic syndromes and certain lymphomas.\n\n' +
        '**Single-cell epigenomics:**\n\n' +
        '| Technology | What it measures | Resolution |\n' +
        '|-----------|-----------------|------------|\n' +
        '| scATAC-seq | Chromatin accessibility | Single cell, genome-wide |\n' +
        '| scBS-seq | DNA methylation | Single cell, single CpG |\n' +
        '| CUT&Tag | Histone modifications | Single cell, genome-wide |\n' +
        '| Spatial transcriptomics (MERFISH, Visium) | Gene expression in tissue context | Sub-cellular |',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            {
              text: 'A liver cell and a neuron have different DNA sequences.',
              answer: false,
              explanation: 'All cells in the body have the same DNA. The difference is which genes are turned on or off (gene expression).',
            },
            {
              text: 'DNA methylation typically silences gene expression.',
              answer: true,
              explanation: 'Correct — methylation of CpG islands recruits proteins that compact chromatin, making the gene inaccessible to RNA polymerase.',
            },
            {
              text: 'Histone acetylation tightens chromatin and silences genes.',
              answer: false,
              explanation: 'Acetylation loosens chromatin (neutralises positive charges on histones), making genes MORE accessible — it activates, not silences.',
            },
            {
              text: 'Epigenetic changes can be influenced by environmental factors like diet and stress.',
              answer: true,
              explanation: 'Correct — environmental factors can alter DNA methylation and histone modifications, affecting gene expression without changing the DNA sequence.',
            },
            {
              text: 'The lac operon is always active when lactose is present, regardless of glucose levels.',
              answer: false,
              explanation: 'Even with lactose present, if glucose is also available, the CAP-cAMP activator is inactive and the operon is only weakly expressed. The cell prefers glucose.',
            },
          ],
        },
      },
    },
  ],
};
