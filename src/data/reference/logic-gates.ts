import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'logic-gates',
  title: 'Logic Gates & Boolean Algebra',
  category: 'electronics',
  icon: '⚡',
  tagline: 'The building blocks of every computer — from simple switches to complex circuits.',
  relatedStories: ['girl-who-spoke-to-elephants'],

  understand: [
    {
      title: 'Switches — Where It All Begins',
      beginnerContent:
        'A light switch is the simplest computer you already own. Flip it up — the light is ON (1). ' +
        'Flip it down — the light is OFF (0). That is one **bit** of information: a single yes-or-no, ' +
        'on-or-off, true-or-false choice. Everything a computer does — playing music, sending messages, ' +
        'running games — boils down to billions of these tiny on/off decisions happening incredibly fast.\n\n' +
        'Why only two states? Because it is far easier to build reliable electronic circuits that distinguish ' +
        'between "electricity flowing" and "no electricity flowing" than to recognize many different voltage levels. ' +
        'This two-state system is called **binary**, and the digits 0 and 1 are called **binary digits** (bits). ' +
        'Eight bits make a **byte**, enough to represent a single letter or a number up to 255.',
      intermediateContent:
        '**Binary works exactly like decimal — just with 2 digits instead of 10:**\n\n' +
        '| Decimal (base 10) | Binary (base 2) |\n' +
        '|---|---|\n' +
        '| 237 = 2×100 + 3×10 + 7×1 | 1101 = 1×8 + 1×4 + 0×2 + 1×1 = **13** |\n\n' +
        '**Quick reference:**\n\n' +
        '| Decimal | Binary | Hex |\n' +
        '|---------|--------|-----|\n' +
        '| 0 | 0000 | 0 |\n' +
        '| 5 | 0101 | 5 |\n' +
        '| 10 | 1010 | A |\n' +
        '| 15 | 1111 | F |\n' +
        '| 255 | 1111 1111 | FF |\n\n' +
        '**To convert decimal → binary:** repeatedly divide by 2, read remainders bottom-to-top.\n\n' +
        '**Hexadecimal (base-16)** is a shorthand — each hex digit (0–9, A–F) represents exactly 4 bits. The color code `#FF6600` is really 24 bits: FF (red=255), 66 (green=102), 00 (blue=0).',
      advancedContent:
        '**CMOS — why modern chips barely use power when idle:**\n\n' +
        'A CMOS inverter (the simplest circuit) uses two transistors:\n' +
        '- **pMOS** (connected to power V_DD): conducts when gate input is LOW → pulls output HIGH\n' +
        '- **nMOS** (connected to ground): conducts when gate input is HIGH → pulls output LOW\n\n' +
        'The critical insight: when input is stable (either HIGH or LOW), exactly one transistor is ON and the other is OFF. ' +
        'There is NO path from power to ground → **zero static current**. Current only flows briefly during switching ' +
        '(both transistors partially ON). This is why a chip with 25 billion transistors doesn\'t melt — most are idle at any moment.\n\n' +
        '**Power equation:** P = C × V² × f, where C = capacitance (wire/gate loading), V = supply voltage, f = switching frequency. ' +
        'This is why reducing voltage from 5V to 1V cuts power by 25× (V² term). Modern chips run at 0.7-1.0V.\n\n' +
        '**Scale comparison:** A transistor in a 3nm chip is ~10 atoms wide. A red blood cell is ~7000 nm. ' +
        'A human hair is ~80,000 nm. You could fit 25,000 transistors across a hair\'s width.',
    },
    {
      title: 'AND Gate — Both Must Be True',
      beginnerContent:
        'Imagine a bank vault that needs **two keys** turned at the same time to open. If only one person shows ' +
        'up, the vault stays locked. Both must be present. That is exactly how an AND gate works: the output is 1 ' +
        '(true) **only** when input A **and** input B are both 1.\n\n' +
        'Truth table:\n\n' +
        '| A | B | Output |\n' +
        '| --- | --- | --- |\n' +
        '| 0 | 0 | 0 |\n' +
        '| 0 | 1 | 0 |\n' +
        '| 1 | 0 | 0 |\n' +
        '| 1 | 1 | 1 |\n\n' +
        'In everyday life, AND logic appears everywhere: a car starts only if the key is in **and** the brake ' +
        'is pressed. A microwave runs only if the door is closed **and** the start button is pressed.',
      intermediateContent:
        '**In Boolean algebra, AND is written as multiplication: A · B or simply AB.**\n\n' +
        'This works because the multiplication table for 0 and 1 matches AND: 0×0=0, 0×1=0, 1×0=0, 1×1=1.\n\n' +
        '| Property | Rule | Why it works |\n' +
        '|----------|------|--------------|\n' +
        '| Identity | A · 1 = A | AND-ing with true changes nothing |\n' +
        '| Null | A · 0 = 0 | If one input is false, output is false |\n' +
        '| Idempotent | A · A = A | AND-ing with yourself changes nothing |\n' +
        '| Commutative | A · B = B · A | Order doesn\'t matter |\n' +
        '| Associative | (A · B) · C = A · (B · C) | Grouping doesn\'t matter |\n\n' +
        'These properties let you simplify complex Boolean expressions — the same way you simplify algebra.',
      advancedContent:
        '**Why NAND is king in real chip design:**\n\n' +
        'You might expect an AND gate to be simpler than NAND. In CMOS, it is the opposite:\n' +
        '- **NAND gate:** 2 pMOS in parallel + 2 nMOS in series = **4 transistors**. Output is LOW only when BOTH inputs are HIGH.\n' +
        '- **AND gate:** NAND + inverter = 4 + 2 = **6 transistors**. More transistors = slower, more area, more power.\n\n' +
        'This is why chip designers think in NAND, not AND. When you write `a AND b` in a hardware description language, ' +
        'the synthesis tool actually builds a NAND followed by a NOT.\n\n' +
        '**Hardware description languages:**\n' +
        '```\n' +
        '// Verilog (C-like syntax)\n' +
        'assign out = a & b;        // AND\n' +
        'assign out = ~(a & b);     // NAND\n' +
        '\n' +
        '-- VHDL (Ada-like syntax)\n' +
        'out <= a AND b;            -- AND\n' +
        'out <= NOT(a AND b);       -- NAND\n' +
        '```\n' +
        'These languages describe WHAT the circuit does (not HOW to build it). Synthesis tools automatically optimize the gate-level implementation.',
      diagram: 'LogicGateSymbolsDiagram',
    },
    {
      title: 'OR Gate — At Least One Must Be True',
      beginnerContent:
        'Picture a house with **two doorbells** — one at the front door, one at the back. If someone presses ' +
        'either bell (or both), the chime rings. That is an OR gate: the output is 1 when input A **or** input B ' +
        '(or both) is 1. The only time the output is 0 is when both inputs are 0 — nobody is ringing.\n\n' +
        'Truth table:\n\n' +
        '| A | B | Output |\n' +
        '| --- | --- | --- |\n' +
        '| 0 | 0 | 0 |\n' +
        '| 0 | 1 | 1 |\n' +
        '| 1 | 0 | 1 |\n' +
        '| 1 | 1 | 1 |\n\n' +
        'A smoke alarm that triggers from smoke **or** heat uses OR logic. A phone that unlocks with fingerprint ' +
        '**or** face recognition is another OR example.',
      intermediateContent:
        '**In Boolean algebra, OR is written as addition: A + B.**\n\n' +
        'The "addition" table for bits: 0+0=0, 0+1=1, 1+0=1, 1+1=1 (not 2 — there is no 2 in Boolean).\n\n' +
        '| Property | Rule | Why it works |\n' +
        '|----------|------|--------------|\n' +
        '| Identity | A + 0 = A | Adding nothing changes nothing |\n' +
        '| Null | A + 1 = 1 | If one input is already true, output is true |\n' +
        '| Idempotent | A + A = A | OR-ing with yourself changes nothing |\n' +
        '| Distributive | A · (B + C) = A·B + A·C | Same as regular algebra |\n' +
        '| Absorption | A + A·B = A | If A is true, the rest doesn\'t matter |',
      advancedContent:
        '**CMOS OR gate — built from NOR + NOT (6 transistors):**\n\n' +
        'Just like AND is NAND+NOT, OR is NOR+NOT. The NOR gate itself is 4 transistors (2 pMOS in series + 2 nMOS in parallel ' +
        '— the exact dual of NAND). Adding the inverter makes 6 total.\n\n' +
        '**Inclusive OR vs Exclusive OR — a source of bugs:**\n' +
        'In logic: OR always means "one or both." A + B = 1 when A=1, B=1. But in English, "or" is often exclusive: ' +
        '"soup or salad" means pick ONE, not both. This mismatch causes programming bugs:\n' +
        '```\n' +
        'if (user.isAdmin OR user.isOwner)  // inclusive: admins AND owners both pass\n' +
        'if (user.isAdmin XOR user.isOwner) // exclusive: only those who are one but NOT both\n' +
        '```\n' +
        'In most code, you want inclusive OR (`||` in most languages). XOR is reserved for specific tasks: ' +
        'bit toggling, swap without temp variable (`a ^= b; b ^= a; a ^= b;`), and cryptography.',
    },
    {
      title: 'NOT Gate — The Inverter',
      beginnerContent:
        'The NOT gate is the simplest gate of all — it has just one input and flips it. Give it a 0, you get 1. ' +
        'Give it a 1, you get 0. Think of it as **opposite day**: whatever you say, the NOT gate says the opposite.\n\n' +
        'Truth table:\n\n' +
        '| A | Output |\n' +
        '| --- | --- |\n' +
        '| 0 | 1 |\n' +
        '| 1 | 0 |\n\n' +
        'NOT is incredibly useful. A "door open" sensor outputs 1 when the door is open. But the alarm system needs ' +
        'to know when the door is **not** open (closed). A NOT gate converts the signal: NOT(open) = closed.',
      intermediateContent:
        'NOT is written with an overbar: ¬A or A̅ (A-bar). Key properties: **involution** (NOT NOT A = A — ' +
        'flipping twice gets you back), **complement** (A · ¬A = 0, A + ¬A = 1 — something ' +
        'cannot be both true and false, and must be one or the other). In circuits, the NOT gate is drawn as a ' +
        'triangle pointing right with a small circle (bubble) at the output. That bubble is the universal symbol ' +
        'for inversion — you will see it on NAND, NOR, and XNOR gates too.',
      advancedContent:
        '**The CMOS inverter — understanding noise margin:**\n\n' +
        'The voltage transfer characteristic (VTC) plots output voltage vs input voltage. Ideally it is a vertical cliff: ' +
        'below the threshold → output is V_DD (HIGH), above → output is 0V (LOW). In reality, the transition is steep but not vertical.\n\n' +
        '**Noise margin** = how much noise a signal can tolerate without being misread:\n' +
        '- V_IL (max input voltage that counts as LOW): ~0.3 × V_DD\n' +
        '- V_IH (min input voltage that counts as HIGH): ~0.7 × V_DD\n' +
        '- Noise margin LOW: V_IL − 0V. Noise margin HIGH: V_DD − V_IH.\n\n' +
        'For a 3.3V chip: anything below ~1V is reliably LOW, above ~2.3V is reliably HIGH. The gap between 1V and 2.3V is the "uncertain" zone — ' +
        'this is why digital signals use full swings (0V or 3.3V) and avoid lingering in the middle.\n\n' +
        '**Fan-out** — how many gates can one output drive:\n' +
        'Each gate input has capacitance (~1-5 fF). The driving gate must charge all these capacitors. ' +
        'More loads = slower switching (RC delay). A typical CMOS gate can drive ~4-10 gates. For higher fan-out, insert a buffer (two inverters in series) ' +
        'that provides more driving current.',
    },
    {
      title: 'NAND and NOR — The Universal Gates',
      beginnerContent:
        'NAND means "NOT AND" — it does an AND, then flips the result. NOR means "NOT OR." These might seem ' +
        'like minor variations, but they have a superpower: **any logic circuit can be built using only NAND gates** ' +
        '(or only NOR gates). That is why they are called **universal gates**.\n\n' +
        'NAND truth table (opposite of AND):\n\n' +
        '| A | B | Output |\n' +
        '| --- | --- | --- |\n' +
        '| 0 | 0 | 1 |\n' +
        '| 0 | 1 | 1 |\n' +
        '| 1 | 0 | 1 |\n' +
        '| 1 | 1 | 0 |\n\n' +
        'Why is this useful? Chip manufacturers can mass-produce billions of identical NAND gates, then wire them ' +
        'differently to create any circuit they need. One building block, infinite possibilities.',
      intermediateContent:
        '**Building ANY gate from NAND alone:**\n\n' +
        '| Gate needed | How to build it from NAND |\n' +
        '|------------|-------------------------|\n' +
        '| NOT | Connect both NAND inputs together: NAND(A, A) = NOT(A) |\n' +
        '| AND | NAND → then NOT (another NAND-as-NOT) |\n' +
        '| OR | NOT each input → then NAND the results |\n\n' +
        'This works because of **De Morgan\'s theorem**: ¬(A · B) = ¬A + ¬B.\n\n' +
        'NOR is also universal — the same trick works with NOR gates instead of NAND.',
      advancedContent:
        '**NAND universality in practice — from 1960s chips to modern FPGAs:**\n\n' +
        'The 7400 chip (1966) contained four 2-input NAND gates on a single IC. Engineers wired them into any logic function needed. ' +
        'This was the building block of early computers, calculators, and industrial controllers.\n\n' +
        '**FPGAs — programmable universal gates:**\n' +
        'A modern FPGA contains thousands of Look-Up Tables (LUTs). Each LUT stores the truth table for ANY Boolean function of N inputs ' +
        '(typically N=4 or N=6). You write your logic in Verilog/VHDL, the compiler maps it to LUT configurations, and the FPGA is reprogrammed in seconds. ' +
        'This is how prototype chips are tested before committing to expensive silicon fabrication.\n\n' +
        '**NAND flash memory — why your SSD is named after a gate:**\n' +
        'In NAND flash, floating-gate transistors are connected in series (like a NAND gate — all must conduct for current to flow). ' +
        'Each transistor stores one bit: a charged floating gate = 0, uncharged = 1. The series connection allows very dense packing — ' +
        'modern 3D NAND stacks 200+ layers vertically, storing up to 4 bits per transistor (QLC). ' +
        'A 1 TB SSD contains roughly 8 trillion of these NAND cells.',
    },
    {
      title: 'XOR — The Odd One Out',
      beginnerContent:
        'Imagine a hallway light controlled by **two switches**, one at each end. If both switches are in the same ' +
        'position (both up or both down), the light is off. If they differ (one up, one down), the light is on. ' +
        'That is XOR — **exclusive OR**. The output is 1 when the inputs are **different**.\n\n' +
        'Truth table:\n\n' +
        '| A | B | Output |\n' +
        '| --- | --- | --- |\n' +
        '| 0 | 0 | 0 |\n' +
        '| 0 | 1 | 1 |\n' +
        '| 1 | 0 | 1 |\n' +
        '| 1 | 1 | 0 |\n\n' +
        'XOR is crucial in computers because it is the heart of binary addition (more on that next) and is also ' +
        'used in error detection, encryption, and graphics.',
      intermediateContent:
        'XOR is written as A ⊕ B. It can be expressed using basic gates: A ⊕ B = (A · ¬B) + (¬A · B). ' +
        'Useful XOR properties: **self-inverse** (A ⊕ A = 0), **identity** (A ⊕ 0 = A), ' +
        '**complementary** (A ⊕ 1 = ¬A). The self-inverse property is why XOR is used in encryption: ' +
        'if you XOR a message with a key to encrypt, XOR-ing the ciphertext with the same key decrypts it. ' +
        'XNOR (the complement of XOR) outputs 1 when inputs are the **same** — it is an equality detector.',
      advancedContent:
        '**XOR = addition modulo 2 — and why that matters for error detection:**\n\n' +
        '0 ⊕ 0 = 0, 0 ⊕ 1 = 1, 1 ⊕ 0 = 1, 1 ⊕ 1 = 0. This is exactly addition with "carry discarded" (mod 2).\n\n' +
        '**Parity check — detecting single-bit errors:**\n' +
        'You want to send the byte 10110010 over a noisy wire. XOR all bits: 1⊕0⊕1⊕1⊕0⊕0⊕1⊕0 = 0 (even parity). ' +
        'Append a parity bit = 0: send 101100100. The receiver XORs all 9 bits. If the result is 0, no error detected. ' +
        'If a single bit flipped during transmission: 1011**1**0100, XOR = 1 — error detected! But parity can\'t tell you WHICH bit flipped.\n\n' +
        '**Hamming codes — detecting AND correcting errors:**\n' +
        'Place parity bits at positions 1, 2, 4, 8… (powers of 2). Each parity bit covers a specific set of data bits:\n' +
        '- Bit 1 checks positions 1,3,5,7,9,11…\n' +
        '- Bit 2 checks positions 2,3,6,7,10,11…\n' +
        '- Bit 4 checks positions 4,5,6,7,12,13…\n\n' +
        'If a bit flips, the parity checks that fail point to the exact position. For example: checks 1 and 4 fail, others pass → ' +
        'the error is at position 1+4 = **5**. Flip bit 5 to correct it. This is how ECC (Error-Correcting Code) RAM works — ' +
        'every 64 bits of data gets 8 Hamming bits, silently correcting single-bit errors caused by cosmic rays or electrical noise.',
    },
    {
      title: 'Combining Gates — Building an Adder',
      beginnerContent:
        'Now the magic begins: by connecting gates together, we can build circuits that **do math**. The simplest ' +
        'is the **half adder**, which adds two single-bit numbers (0+0, 0+1, 1+0, or 1+1).\n\n' +
        'It uses just two gates:\n' +
        '• An **XOR gate** produces the **sum** bit (because 0+0=0, 0+1=1, 1+0=1, 1+1=0 with a carry)\n' +
        '• An **AND gate** produces the **carry** bit (because only 1+1 generates a carry of 1)\n\n' +
        'Two half adders plus an OR gate make a **full adder** that also handles a carry-in from a previous ' +
        'column. Chain eight full adders together and you get an 8-bit adder that can add numbers up to 255. ' +
        'This is the core of the ALU (Arithmetic Logic Unit) inside every processor.',
      intermediateContent:
        'A **ripple-carry adder** chains N full adders, with each carry-out feeding the next carry-in. It is ' +
        'simple but slow: the carry must "ripple" through all N stages. For a 64-bit add, the worst case requires ' +
        'the carry to propagate through all 64 stages. A **carry-lookahead adder** (CLA) computes carries in ' +
        'parallel using **generate** (G = A · B) and **propagate** (P = A ⊕ B) signals: C_i = G_i + P_i · C_{i-1}. ' +
        'This reduces addition time from O(N) to O(log N) gate delays.',
      advancedContent:
        '**Carry-select adder — computing both answers in advance:**\n\n' +
        'A ripple-carry adder is slow: the carry must propagate through all N bits sequentially. ' +
        'A carry-select adder splits the bits into blocks and computes each block TWICE — once assuming carry-in = 0, ' +
        'once assuming carry-in = 1. When the actual carry arrives, a multiplexer selects the correct result instantly. ' +
        'Cost: 2× the gates but much faster (O(√N) delay instead of O(N)).\n\n' +
        '**How hardware multiplication works:**\n' +
        'Multiply 1011 × 1101 (11 × 13 = 143). Just like long multiplication in decimal:\n' +
        '```\n' +
        '    1011  (11)\n' +
        '  × 1101  (13)\n' +
        '  ------\n' +
        '    1011  (1011 × 1)\n' +
        '   0000   (1011 × 0, shifted left 1)\n' +
        '  1011    (1011 × 1, shifted left 2)\n' +
        ' 1011     (1011 × 1, shifted left 3)\n' +
        '--------\n' +
        '10001111  (143)\n' +
        '```\n' +
        'Each row is a "partial product" (AND of one multiplier bit with the multiplicand). ' +
        'A Wallace tree adds all partial products in parallel using layers of full adders, reducing ' +
        'an N-bit multiplication from O(N²) sequential additions to O(log N) layers. ' +
        'A 64-bit multiply completes in ~3 clock cycles on a modern CPU.',
      diagram: 'LogicHalfAdderDiagram',
      interactive: {
        type: 'logic-gate-simulator' as const,
        props: {},
      },
    },
    {
      title: 'From Gates to Processors',
      beginnerContent:
        'A modern smartphone processor contains **billions** of transistors, each acting as a tiny switch. They build on each other in layers:\n\n' +
        '| Level | What it is | Built from |\n' +
        '|-------|-----------|------------|\n' +
        '| Transistor | A tiny switch (on/off) | Silicon + electricity |\n' +
        '| Gate | AND, OR, NOT | 2-6 transistors |\n' +
        '| Adder | Adds two numbers | A few gates |\n' +
        '| ALU | Does all math + logic | Many adders + comparators |\n' +
        '| CPU | The brain of the computer | ALU + registers + control unit |\n\n' +
        '**Moore\'s Law** (1965): the number of transistors on a chip doubles roughly every two years.\n\n' +
        '| Year | Chip | Transistors |\n' +
        '|------|------|------------|\n' +
        '| 1971 | Intel 4004 | 2,300 |\n' +
        '| 1993 | Pentium | 3,100,000 |\n' +
        '| 2010 | Core i7 | 731,000,000 |\n' +
        '| 2023 | Apple M3 | 25,000,000,000 |\n\n' +
        'Yet every one of those 25 billion transistors is still just a switch, and every circuit is still built from the same AND, OR, NOT gates you just learned.\n\n' +
        'Everything is binary. Everything is gates. That is the profound simplicity at the heart of all computing.',
      intermediateContent:
        '**The fetch-decode-execute cycle — what a CPU does billions of times per second:**\n\n' +
        '| Stage | What happens | Example |\n' +
        '|-------|-------------|--------|\n' +
        '| **Fetch** | Read the next instruction from memory | "Get instruction at address 0x4A20" |\n' +
        '| **Decode** | Figure out what operation it specifies | "This is an ADD instruction" |\n' +
        '| **Execute** | Perform the operation in the ALU | "Add registers R1 and R2, store in R3" |\n\n' +
        '**How modern CPUs go faster:**\n\n' +
        '| Technique | What it does |\n' +
        '|-----------|-------------|\n' +
        '| Pipelining | Overlap stages — while one instruction executes, the next is being decoded, and the one after is being fetched |\n' +
        '| Superscalar | Multiple ALUs working in parallel — execute 4+ instructions per cycle |\n' +
        '| Branch prediction | Guess which way an if-statement will go to avoid stalling the pipeline |\n\n' +
        'A 3 GHz CPU completes **3 billion** of these cycles per second.',
      advancedContent:
        '**The end of Moore\'s Law — and what comes next:**\n\n' +
        '| Node size | Year | Transistors | Key challenge |\n' +
        '|---|---|---|---|\n' +
        '| 90 nm | 2004 | ~100 million | Leakage current begins |\n' +
        '| 22 nm | 2012 | ~1 billion | FinFET 3D transistors needed |\n' +
        '| 5 nm | 2020 | ~15 billion | EUV lithography required |\n' +
        '| 2 nm | 2025 | ~50 billion | Gate-all-around transistors |\n' +
        '| <1 nm | ??? | ??? | Quantum tunneling makes scaling impossible |\n\n' +
        '**Below ~3 nm, quantum tunneling** causes electrons to "leak" through barriers that should stop them — ' +
        'like a ball rolling through a wall instead of bouncing off. This increases power consumption and causes random bit errors.\n\n' +
        '**Three responses to the wall:**\n' +
        '1. **3D stacking:** Instead of shrinking transistors, stack chips vertically. Apple\'s M3 Ultra bonds two M3 Max dies. ' +
        'HBM (High Bandwidth Memory) stacks 8-12 memory dies.\n' +
        '2. **Chiplets:** Build small, specialized dies and connect them on a package (AMD\'s Zen 4: 5nm compute chiplets + 6nm I/O die). ' +
        'Cheaper than one giant chip because small dies have higher yield.\n' +
        '3. **New paradigms:** Quantum computing (exponential parallelism for specific problems like factoring, optimization), ' +
        'neuromorphic chips (Intel Loihi: hardware neurons that fire like brain cells, 1000× more energy-efficient for ML inference).\n\n' +
        '**Karnaugh maps — simplifying Boolean expressions visually:**\n' +
        'Write the truth table as a grid where adjacent cells differ by one bit. Group adjacent 1s into rectangles (sizes 1,2,4,8…). ' +
        'Each group becomes one term in the simplified expression. A 4-variable function that needs 8 AND-OR terms might simplify to 2. ' +
        'Fewer terms = fewer gates = faster, cheaper, less power.',
      diagram: 'LogicProcessorDiagram',
    },
  ],
};
