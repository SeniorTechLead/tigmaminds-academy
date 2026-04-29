import type { ReferenceGuide } from '../reference';
import { practiceFactorsMultiples, practicePrimes, practiceGcdLcm, practiceSequences, practiceModular } from '../practice-number-theory';

export const guide: ReferenceGuide = {
  slug: 'number-theory-and-sequences',
  title: 'Number Theory & Sequences',
  category: 'math',
  icon: '📐',
  tagline: 'Primes, factors, and the hidden patterns inside numbers themselves.',
  relatedStories: ['boy-counted-butterflies', 'bamboo-grows-fast'],
  understand: [
    // ─────────────────────────────────────────────────────────────
    // 1. Factors and Multiples
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Factors and Multiples',
      beginnerContent:
        '**Tara has 24 chocolates and a question.** Can she share them equally among her friends? It depends on how many friends. With 6 friends, each gets 4. With 4 friends, each gets 6. With 5 friends — *uh oh* — 24 doesn\'t split evenly into 5.\n\n' +
        '[diagram:SharingChocolatesDiagram]\n\n' +
        'The numbers that *do* split 24 evenly are 1, 2, 3, 4, 6, 8, 12, and 24. We call them the **factors** of 24.\n\n' +
        '**Two key words.**\n\n' +
        '| Word | Definition | Example |\n' +
        '|------|-----------|---------|\n' +
        '| **Factor** of n | A number that divides n with no remainder | 6 is a factor of 24 because 24 ÷ 6 = 4 |\n' +
        '| **Multiple** of n | A number you get by multiplying n by a positive integer | 14 is a multiple of 7 (because 7 × 2 = 14) |\n\n' +
        'Note the symmetry: if a is a factor of b, then b is a multiple of a. The pair always travels together.\n\n' +
        '**The DNA of every number — prime factorisation.** Take any number bigger than 1 and break it down into the smallest pieces that still multiply to give the original. Those pieces are *prime numbers* (more on these in the next section). The breakdown is unique: there is exactly one way to do it. That fact is so important it has a name — the **Fundamental Theorem of Arithmetic**.\n\n' +
        '**Walked example — factorise 360.**\n\n' +
        '| Step | What to do | Result so far |\n' +
        '|------|-----------|---------------|\n' +
        '| 1 | 360 is even, divide by 2 | 360 = 2 × 180 |\n' +
        '| 2 | 180 is even, divide by 2 | 360 = 2 × 2 × 90 |\n' +
        '| 3 | 90 is even, divide by 2 | 360 = 2³ × 45 |\n' +
        '| 4 | 45 is not even. Divisible by 3? (4+5=9, yes) | 360 = 2³ × 3 × 15 |\n' +
        '| 5 | 15 is divisible by 3 | 360 = 2³ × 3² × 5 |\n' +
        '| 6 | 5 is prime — done | **360 = 2³ × 3² × 5** |\n\n' +
        '**Counting the factors of a number — without listing them.** If the prime factorisation is `n = p₁^a · p₂^b · p₃^c`, the number of factors is **(a+1)(b+1)(c+1)**. For 360 = 2³ · 3² · 5¹, that is (3+1)(2+1)(1+1) = **24 factors**. Try listing them — yes, 24 of them: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180, 360.\n\n' +
        '**Check yourself.** Without listing, how many factors does 1000 = 2³ × 5³ have? *(Answer: (3+1)(3+1) = **16 factors**.)*\n\n' +
        '**Where this shows up.**\n\n' +
        '| Setting | The factor question |\n' +
        '|---------|---------------------|\n' +
        '| Sharing 120 students into equal groups | What are the factors of 120? |\n' +
        '| Filling 750-ml bottles from a 15-litre tin of mustard oil | Does 15000 ÷ 750 leave no remainder? Yes — 20 bottles. |\n' +
        '| Cutting a 36 m × 24 m field into equal square plots, biggest possible | Common factor of 36 and 24 — 12 m × 12 m squares |\n' +
        '| Tiles of size 8 cm × 12 cm covering a 96 × 84 floor with no cutting | Does 8 divide 96? 12 divide 84? Yes to both. |',
      intermediateContent:
        '**The Euclidean algorithm — finding GCD without listing factors.** Listing every factor of two big numbers is slow. The Euclidean algorithm is over 2,300 years old and still the way computers do it.\n\n' +
        '**Idea.** GCD(a, b) = GCD(b, a mod b). Replace the bigger number with the remainder, repeat. The last non-zero remainder is the GCD.\n\n' +
        '**Worked example — GCD(252, 198).**\n\n' +
        '| Step | Division | Remainder |\n' +
        '|------|----------|-----------|\n' +
        '| 1 | 252 = **1** × 198 + **54** | 54 |\n' +
        '| 2 | 198 = **3** × 54 + **36** | 36 |\n' +
        '| 3 | 54 = **1** × 36 + **18** | 18 |\n' +
        '| 4 | 36 = **2** × 18 + **0** | 0 — stop |\n\n' +
        'Last non-zero remainder is **GCD(252, 198) = 18**.\n\n' +
        '**Why it terminates fast.** Lamé\'s theorem (1844) says the number of steps never exceeds 5 times the number of digits of the smaller input. So GCD on two 100-digit numbers takes at most 500 steps — milliseconds, not lifetimes.\n\n' +
        '**Sum of factors — same trick.** For 360 = 2³ × 3² × 5, the sum of all 24 factors is\n\n' +
        '`(1 + 2 + 4 + 8) × (1 + 3 + 9) × (1 + 5) = 15 × 13 × 6 = 1170`\n\n' +
        'Each factor appears in the expanded product exactly once.',
      advancedContent:
        '**The Prime Number Theorem.** Sound the trumpet. Among the first n positive integers, the *number* of primes is approximately\n\n' +
        '`π(n) ≈ n / ln n`\n\n' +
        'For n = 1,000,000 the prediction is ~72,382 primes. The actual count is 78,498 — a relative error of 8%, and the error keeps shrinking as n grows. Riemann\'s 1859 paper conjectured a much sharper formula whose error term depends on the location of zeros of the Riemann zeta function `ζ(s) = Σ 1/nˢ`.\n\n' +
        '**The Riemann Hypothesis.** All non-trivial zeros of ζ(s) lie on the line Re(s) = 1/2. If true, it pins down the error in the prime-counting function precisely. It has been verified numerically for the first ten *trillion* zeros — but no proof. Carries a $1,000,000 Millennium Prize and is widely considered the most important open problem in mathematics.\n\n' +
        '**Why number theorists stay up at night.** Most "obvious" claims about primes are out of reach: are there infinitely many primes p with p+2 also prime (twin primes)? Is every even number > 2 a sum of two primes (Goldbach)? Both verified for absurdly large numbers, neither proved.',
      interactive: { type: 'python-playground', props: { starterCode: '# List the factors of any number\n\nn = 360\n\nfactors = [d for d in range(1, n + 1) if n % d == 0]\nprint(f"Factors of {n}: {factors}")\nprint(f"Count: {len(factors)}")\n\n# Bonus: print prime factorisation\nfrom math import isqrt\ndef prime_factors(n):\n    pf = []\n    for p in range(2, isqrt(n) + 1):\n        while n % p == 0:\n            pf.append(p)\n            n //= p\n    if n > 1:\n        pf.append(n)\n    return pf\n\nprint(f"Prime factorisation: {prime_factors(360)}")\n', title: 'Try it — factorise any number' } },
      practice: practiceFactorsMultiples,
    },

    // ─────────────────────────────────────────────────────────────
    // 2. Prime Numbers — The Atoms of Arithmetic
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Prime Numbers — The Atoms of Arithmetic',
      beginnerContent:
        '**Imagine numbers as molecules.** 12 is built from 2 × 2 × 3. 30 is 2 × 3 × 5. 100 is 2 × 2 × 5 × 5. Every composite number breaks into smaller pieces that can\'t be broken down further. Those final pieces — the indivisible building blocks — are the **prime numbers**.\n\n' +
        '[diagram:PrimeAtomsDiagram]\n\n' +
        '**Definition.** A prime is a whole number greater than 1 whose only factors are 1 and itself.\n\n' +
        '| Number | Factors | Prime? |\n' +
        '|--------|---------|--------|\n' +
        '| 2 | 1, 2 | **yes** (the only even prime!) |\n' +
        '| 3 | 1, 3 | yes |\n' +
        '| 4 | 1, 2, 4 | no — 2 sneaks in |\n' +
        '| 5 | 1, 5 | yes |\n' +
        '| 6 | 1, 2, 3, 6 | no |\n' +
        '| 7 | 1, 7 | yes |\n' +
        '| 9 | 1, 3, 9 | no |\n' +
        '| 11 | 1, 11 | yes |\n\n' +
        'The first ten primes: **2, 3, 5, 7, 11, 13, 17, 19, 23, 29**. Note that 2 is the *only* even prime — every other even number has 2 as a factor and so isn\'t prime.\n\n' +
        '**Are there infinitely many?** Yes — and Euclid proved it 2,300 years ago in three lines:\n\n' +
        '> Suppose there were only finitely many primes p₁, p₂, ..., pₙ. Form the number N = p₁ × p₂ × ... × pₙ + 1. Either N is prime (and it is bigger than any of our supposed list) or it has a prime factor — but that factor cannot be any pᵢ, because dividing N by pᵢ leaves remainder 1. Either way, we have found a prime not in our original list. Contradiction.\n\n' +
        'Math doesn\'t get more elegant than that.\n\n' +
        '**Sieve of Eratosthenes — find every prime up to 100.** Devised around 240 BCE. Write 2, 3, 4, ..., 100. Circle 2 (it\'s prime); cross out 4, 6, 8, ... (multiples of 2). Move to next uncrossed: 3 — circle it; cross out 9, 15, 21, ... Move to 5, then 7. Stop when you reach √100 = 10. Everything still uncrossed is prime.\n\n' +
        '**Why does the sieve work after just √n?** If n has a factor f > √n, the matching co-factor n/f must be < √n — and you would have crossed n out when you handled that smaller factor. So any composite ≤ n is caught by some prime ≤ √n.\n\n' +
        '**Where primes show up that you might not expect.**\n\n' +
        '| Application | Where the primes are |\n' +
        '|-------------|---------------------|\n' +
        '| RSA encryption (online banking, HTTPS) | Public-key cryptosystems multiply two huge primes; security comes from how hard factoring back is |\n' +
        '| Prime gears in old factory machinery | Two gears with co-prime tooth counts (no shared factor) wear evenly because every tooth eventually meets every other |\n' +
        '| Cicada life cycles | Some species emerge every 13 or 17 years — both prime — so they never sync up with predator cycles of 2, 3, 4 years |\n' +
        '| Hash table sizes in software | Bucket counts are often prime to spread keys evenly |\n\n' +
        '**Check yourself.** Is 91 prime? *(Hint: 7 × 13 = 91. Not prime.)*',
      intermediateContent:
        '**Probabilistic primality testing — checking million-digit numbers.** For very large n, listing factors is hopeless. The **Miller-Rabin test** uses a clever consequence of Fermat\'s Little Theorem:\n\n' +
        '*If p is prime and a is not a multiple of p, then a^(p−1) ≡ 1 (mod p).*\n\n' +
        '| Step | Action | Outcome |\n' +
        '|------|--------|---------|\n' +
        '| 1 | Pick a random base a between 2 and n−2 | — |\n' +
        '| 2 | Compute a^(n−1) mod n using fast exponentiation | takes O(log n) modular multiplications |\n' +
        '| 3 | If result ≠ 1, n is **definitely composite** | done |\n' +
        '| 4 | Otherwise, n is "probably prime"; repeat with k random bases | error probability < 4⁻ᵏ after k passes |\n\n' +
        'After k = 20 passes, the chance of falsely declaring a composite "prime" is less than 1 in a *trillion*. RSA-2048 keys generate two 1024-bit primes by repeatedly testing random odd numbers until 20-pass Miller-Rabin survives.\n\n' +
        '**AKS algorithm (2002).** Agrawal, Kayal & Saxena — three Indian mathematicians at IIT Kanpur — proved you can deterministically check primality in polynomial time, settling a long-open question. In practice, Miller-Rabin is faster, but AKS is theoretically beautiful.',
      advancedContent:
        '**The unsolved beauty of primes.**\n\n' +
        '| Conjecture | Statement | Status (2026) |\n' +
        '|-----------|-----------|---------------|\n' +
        '| **Twin primes** | Infinitely many primes p with p+2 also prime | Yitang Zhang (2013) proved gap ≤ 70 million; reduced to 246. Twin (gap=2) still open. |\n' +
        '| **Goldbach** | Every even integer > 2 is a sum of two primes | Verified to 4×10¹⁸. Open. |\n' +
        '| **Riemann Hypothesis** | All non-trivial zeros of ζ(s) on line Re(s) = 1/2 | Open. $1M Millennium Prize. |\n' +
        '| **Green-Tao (2004)** | Primes contain arbitrarily long arithmetic progressions | **Proved**: e.g. 7, 37, 67, 97, 127, 157 — six primes spaced by 30. |\n\n' +
        '**Practical impact of the Riemann Hypothesis.** A proof would not break encryption (RSA depends on factoring being hard, not on prime gaps), but it would tighten our control of the prime-counting function and validate decades of conditional theorems in analytic number theory. Mathematicians have written hundreds of papers beginning "*Assuming RH*..." waiting for the day someone removes that assumption.',
      diagram: 'SieveOfEratosthenesDiagram',
      practice: practicePrimes,
    },

    // ─────────────────────────────────────────────────────────────
    // 3. GCD and LCM
    // ─────────────────────────────────────────────────────────────
    {
      title: 'GCD and LCM',
      beginnerContent:
        '**Tara stands at a Guwahati bus stop.** Bus A leaves every 12 minutes. Bus B leaves every 18 minutes. They both depart at 8:00 AM. When will they next leave together?\n\n' +
        '[diagram:TwoBusesLCMDiagram]\n\n' +
        '**Two ideas, both essential.**\n\n' +
        '| Term | Meaning | Example |\n' +
        '|------|---------|---------|\n' +
        '| **GCD(a, b)** Greatest Common Divisor | The biggest number that divides both a and b | GCD(12, 18) = **6** (both 12 and 18 are divisible by 6, nothing larger works) |\n' +
        '| **LCM(a, b)** Least Common Multiple | The smallest positive number that is a multiple of both a and b | LCM(12, 18) = **36** (the first time 12-table and 18-table agree) |\n\n' +
        '**The bus answer.** They next leave together at 8:00 + LCM(12, 18) = 8:00 + 36 minutes = **8:36 AM**. This is exactly what the diagram shows: the first place after 0 where both timelines mark a departure.\n\n' +
        '**Finding GCD by listing factors (small numbers).**\n\n' +
        '| Step | Action | Result |\n' +
        '|------|--------|--------|\n' +
        '| 1 | Factors of 12 | 1, 2, 3, 4, 6, **12** |\n' +
        '| 2 | Factors of 18 | 1, 2, 3, 6, 9, 18 |\n' +
        '| 3 | Common factors | 1, 2, 3, **6** |\n' +
        '| 4 | Pick the biggest | GCD = **6** |\n\n' +
        '**Finding LCM by listing multiples.**\n\n' +
        '| Step | Action | Result |\n' +
        '|------|--------|--------|\n' +
        '| 1 | Multiples of 12 | 12, 24, **36**, 48, 60 |\n' +
        '| 2 | Multiples of 18 | 18, **36**, 54, 72 |\n' +
        '| 3 | Smallest common one | LCM = **36** |\n\n' +
        '**A cleaner shortcut.** GCD and LCM are linked by a simple identity:\n\n' +
        '`GCD(a, b) × LCM(a, b) = a × b`\n\n' +
        'Verify: 6 × 36 = 216 = 12 × 18 ✓. So once you have one, the other is one division away.\n\n' +
        '**Where these show up beyond buses.**\n\n' +
        '| Setting | GCD or LCM? |\n' +
        '|---------|-------------|\n' +
        '| Cutting a 36 × 24 metre field into equal square plots, biggest possible | GCD(36, 24) = 12 m squares |\n' +
        '| Two clocks chime every 6 and every 8 seconds — when do they chime together? | LCM(6, 8) = every 24 s |\n' +
        '| Two cogs with 14 and 21 teeth — when do they realign? | LCM(14, 21) = 42 turns |\n' +
        '| Reduce the fraction 84/126 to lowest terms | Divide top and bottom by GCD(84, 126) = 42 → 2/3 |\n\n' +
        '**Check yourself.** Two festival drums beat every 4 and every 6 seconds. When do they next beat together? *(LCM(4, 6) = **12 seconds**.)*',
      intermediateContent:
        '**The Euclidean algorithm — find GCD fast for any size.** (See the previous section for the full table.) Once GCD is in hand, `LCM(a, b) = a × b / GCD(a, b)` gives LCM for free.\n\n' +
        '**Extended Euclidean — finding x, y with ax + by = GCD(a, b).** Bézout\'s identity. Run the Euclidean algorithm forward, then back-substitute.\n\n' +
        '**Worked example — find x, y for 252x + 198y = 18 (= GCD).**\n\n' +
        '| Step | Equation | Comment |\n' +
        '|------|----------|---------|\n' +
        '| 1 | 252 = 1×198 + 54 → 54 = 252 − 1×198 | express 54 in terms of 252 and 198 |\n' +
        '| 2 | 198 = 3×54 + 36 → 36 = 198 − 3×54 = 198 − 3(252 − 198) = −3·252 + 4·198 | now 36 |\n' +
        '| 3 | 54 = 1×36 + 18 → 18 = 54 − 36 = (252 − 198) − (−3·252 + 4·198) = 4·252 − 5·198 | now 18 |\n\n' +
        'So **18 = 4 × 252 + (−5) × 198**. Verify: 4×252 = 1008, 5×198 = 990, 1008 − 990 = 18 ✓. The coefficients 4 and −5 are the **Bézout coefficients**.\n\n' +
        '**Why does this matter?** Bézout coefficients are how you compute **modular inverses**, the backbone of RSA decryption. To find 7⁻¹ mod 26, solve 7x + 26y = 1. The extended Euclidean algorithm gives x = 15. Check: 7 × 15 = 105 = 4 × 26 + 1, so 7 × 15 ≡ 1 (mod 26). ✓',
      advancedContent:
        '**Chinese Remainder Theorem (CRT).** If GCD(m₁, m₂) = 1, the system\n\n' +
        '`x ≡ a₁ (mod m₁), x ≡ a₂ (mod m₂)`\n\n' +
        'has a unique solution modulo m₁ · m₂. Generalises to any number of pairwise coprime moduli.\n\n' +
        '**Worked example.** Solve x ≡ 2 (mod 3) and x ≡ 3 (mod 5) for x in [0, 15).\n\n' +
        'Try the multiples of 5 plus 3: 3, 8, 13. Test each mod 3: 3 mod 3 = 0 ✗, 8 mod 3 = 2 ✓, 13 mod 3 = 1 ✗. So **x = 8**, and the full solution set is 8, 23, 38, ... (all ≡ 8 mod 15).\n\n' +
        '**Why CRT shows up in practice.**\n\n' +
        '| Application | The CRT angle |\n' +
        '|-------------|---------------|\n' +
        '| RSA decryption (4× speedup) | Compute c^d mod p and c^d mod q separately, combine via CRT instead of doing one huge mod n exponentiation |\n' +
        '| Aadhaar / IBAN / ISBN check digits | Use coprime moduli; a single typo flips at least one residue, exposing the error |\n' +
        '| Computer arithmetic on huge integers | Split a number into residues mod several primes, do arithmetic in parallel, recombine |\n' +
        '| Calendar mathematics | Day of week + day of month + lunar phase form a CRT-like system used to align festivals like Bihu with both solar and lunar cycles |\n\n' +
        '**A two-line history note.** The theorem is named for the 3rd-century Chinese text *Sunzi Suanjing*, which posed a version of this puzzle: "find a number that leaves remainder 2 when divided by 3, 3 by 5, and 2 by 7." Indian mathematician **Aryabhata** (476–550 CE) developed independent methods around the same era — number theory has long been a global story.',
      practice: practiceGcdLcm,
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Sequences — Arithmetic and Geometric
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Sequences — Arithmetic and Geometric',
      beginnerContent:
        '**A schoolteacher in 18th-century Germany asked his class to add 1 + 2 + 3 + ... + 100.** He expected silence and an hour of scribbling. One eight-year-old, Carl Friedrich Gauss, looked up after thirty seconds with the answer: **5,050**.\n\n' +
        '[diagram:GaussSumDiagram]\n\n' +
        '**How did he do it?** He didn\'t add 100 numbers. He noticed that pairing the first and last (1 + 100 = 101), the second and second-last (2 + 99 = 101), the third and third-last (3 + 98 = 101) — every pair gives **101**. There are 50 such pairs, so the total is 50 × 101 = 5,050. *That* is what spotting a pattern does.\n\n' +
        '**Two pattern types you must recognise.**\n\n' +
        '| Type | Each term is the previous, + or × by a constant | Example | The constant |\n' +
        '|------|------------------------------------------------|---------|--------------|\n' +
        '| **Arithmetic** | **adds** a fixed amount | 3, 7, 11, 15, 19 | common difference d = 4 |\n' +
        '| **Geometric** | **multiplies** by a fixed amount | 2, 6, 18, 54, 162 | common ratio r = 3 |\n\n' +
        '**Arithmetic formulas.**\n\n' +
        '| Quantity | Formula | What each letter means |\n' +
        '|----------|---------|------------------------|\n' +
        '| nth term | aₙ = a₁ + (n − 1)d | a₁ first term, d common difference |\n' +
        '| Sum of first n terms | Sₙ = n/2 × (a₁ + aₙ) | the **pairing trick** in formula form |\n' +
        '| Same sum, different form | Sₙ = n/2 × (2a₁ + (n − 1)d) | useful when you don\'t already know aₙ |\n\n' +
        '**Walked example — Gauss made formal.**\n\n' +
        '| Step | Reasoning | Result |\n' +
        '|------|-----------|--------|\n' +
        '| 1 | a₁ = 1, d = 1, n = 100 | — |\n' +
        '| 2 | a₁₀₀ = 1 + 99 × 1 | a₁₀₀ = 100 ✓ |\n' +
        '| 3 | Sum = 100/2 × (1 + 100) | 50 × 101 |\n' +
        '| 4 | Final | **5,050** |\n\n' +
        '**Geometric formulas.**\n\n' +
        '| Quantity | Formula | Why |\n' +
        '|----------|---------|-----|\n' +
        '| nth term | aₙ = a₁ · rⁿ⁻¹ | start from a₁, multiply by r exactly n−1 times |\n' +
        '| Sum of first n terms | Sₙ = a₁ · (rⁿ − 1) / (r − 1)  (if r ≠ 1) | algebraic identity, derived in advanced |\n' +
        '| Sum of *infinitely* many terms when |r| < 1 | S∞ = a₁ / (1 − r) | the rⁿ shrinks to zero |\n\n' +
        '**The bouncing-ball example.** A ball is dropped from 10 m and bounces to 60% of its previous height each time. Total *distance* (up + down) over infinite bounces?\n\n' +
        '| Step | Reasoning | Calc |\n' +
        '|------|-----------|------|\n' +
        '| 1 | First drop: 10 m down | 10 |\n' +
        '| 2 | First bounce: 6 m up + 6 m down = 12 m. Second bounce: 7.2 m. Each bounce is 60% of the previous bounce-height. | 2 × 10 × (0.6 + 0.6² + 0.6³ + ...) |\n' +
        '| 3 | Geometric series with a₁ = 0.6, r = 0.6. Sum = 0.6 / (1 − 0.6) = 1.5 | — |\n' +
        '| 4 | Total = 10 + 2 × 10 × 1.5 | **40 m** |\n\n' +
        '**Check yourself.** Bamboo grows at 91 cm in one day under ideal conditions. If a particular shoot doubles its growth-rate every two days starting at 1 cm/day, how fast is it growing on day 9? *(Geometric, r = 2, a₁ = 1: rate on day 1 is 1, day 3 is 2, day 5 is 4, day 7 is 8, day 9 is **16 cm/day**.)*',
      intermediateContent:
        '**Deriving the geometric sum formula** (a beautiful 3-line trick).\n\n' +
        'Let `S = a + ar + ar² + ... + arⁿ⁻¹`. Multiply both sides by r:\n\n' +
        '`rS = ar + ar² + ar³ + ... + arⁿ`\n\n' +
        'Subtract: `S − rS = a − arⁿ`, so `S(1 − r) = a(1 − rⁿ)`, giving `S = a(1 − rⁿ)/(1 − r) = a(rⁿ − 1)/(r − 1)`.\n\n' +
        '**Telescoping sums.** Some sums collapse because each term cancels with the next:\n\n' +
        '`Σ 1/(k(k+1)) = (1 − 1/2) + (1/2 − 1/3) + (1/3 − 1/4) + ... = 1 − 1/(n+1)`\n\n' +
        'As n → ∞ the partial fraction telescopes to **exactly 1**.',
      advancedContent:
        '**The harmonic series.** `1 + 1/2 + 1/3 + 1/4 + 1/5 + ...` looks like it should converge — terms shrink to zero. It does **not**. It diverges, but at a snail\'s pace.\n\n' +
        'Group: 1/3 + 1/4 > 1/4 + 1/4 = 1/2. Then 1/5 + 1/6 + 1/7 + 1/8 > 4 × 1/8 = 1/2. Each doubling of terms contributes another half. Infinitely many halves → infinite sum.\n\n' +
        '**The coupon collector problem.** A cereal company puts one of 50 collectible cards in each box. How many boxes do you expect to buy to collect all 50?\n\n' +
        'Once you have k different cards, the chance the next box gives a *new* card is (50 − k)/50. Expected boxes for that next new card: 50/(50 − k). Total expected:\n\n' +
        '`50/50 + 50/49 + 50/48 + ... + 50/1 = 50 × H₅₀`\n\n' +
        'where Hₙ is the nth harmonic number ≈ ln n + 0.577 (Euler–Mascheroni). For n = 50, H₅₀ ≈ 4.5, so expected boxes ≈ **224**.\n\n' +
        '**Convergence tests.** Three tools tell you whether an infinite series sums to a finite number:\n\n' +
        '| Test | Idea | When it works |\n' +
        '|------|------|---------------|\n' +
        '| Ratio test | Look at lim |aₙ₊₁/aₙ| | Series like Σ xⁿ/n!, where ratio is x/(n+1) → 0 |\n' +
        '| Comparison | Compare term-by-term to a known series | Σ 1/n² < Σ 1/n(n−1) — converges |\n' +
        '| Integral test | Sum looks like an integral of a decreasing function | Σ 1/n^p converges iff p > 1 |\n\n' +
        'These tests are how engineers decide whether truncated series approximations (Taylor, Fourier, perturbation expansions) actually represent the function they claim to.',
      diagram: 'SequencePatternDiagram',
      practice: practiceSequences,
    },

    // ─────────────────────────────────────────────────────────────
    // 5. Modular Arithmetic — Clock Math
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Modular Arithmetic — Clock Math',
      beginnerContent:
        '**Tara glances at the wall clock. It is 10 o\'clock. Her bus arrives in 5 hours. What time will it be?**\n\n' +
        '[diagram:ClockArithmeticDiagram]\n\n' +
        '*Not* 15 o\'clock. 3 o\'clock. The clock face only has 12 positions, so when you go past 12, you start over at 1. That is **modular arithmetic** — the math of remainders.\n\n' +
        '**The notation.** "17 mod 5 = 2" means "17 divided by 5 leaves a remainder of 2." We also write **17 ≡ 2 (mod 5)**, read as *17 is congruent to 2, modulo 5*.\n\n' +
        '**Where you have already used this without naming it.**\n\n' +
        '| Setting | Modulus | Example |\n' +
        '|---------|---------|---------|\n' +
        '| Wall clock | 12 | 10 + 5 ≡ 3 (mod 12) |\n' +
        '| 24-hour clock | 24 | 22:00 + 5 hours = 03:00 = 27 mod 24 |\n' +
        '| Days of the week | 7 | If today is Wednesday (day 3), 10 days later is day 13 mod 7 = 6 → Saturday |\n' +
        '| Calendar month | varies | "What\'s the date 50 days from May 12?" |\n' +
        '| Music intervals | 12 | Notes a perfect octave apart are congruent mod 12 in semitones |\n\n' +
        '**Modular arithmetic obeys familiar rules.** If `a ≡ b (mod n)` and `c ≡ d (mod n)`, then\n\n' +
        '| Operation | Rule |\n' +
        '|-----------|------|\n' +
        '| Addition | a + c ≡ b + d (mod n) |\n' +
        '| Subtraction | a − c ≡ b − d (mod n) |\n' +
        '| Multiplication | a × c ≡ b × d (mod n) |\n\n' +
        '(Division is trickier and needs **modular inverses** — see the advanced section.)\n\n' +
        '**The divisibility-by-9 trick.** A number is divisible by 9 iff its digit sum is. Why? Because 10 ≡ 1 (mod 9), so 10ᵏ ≡ 1 (mod 9), so any number written 7263 = 7×10³ + 2×10² + 6×10¹ + 3 reduces mod 9 to 7+2+6+3 = 18, and 18 mod 9 = 0. Hence 7263 is divisible by 9. (Indeed 7263 / 9 = 807.)\n\n' +
        '**Walked example — what day of the week is 100 days from Wednesday?**\n\n' +
        '| Step | Action | Result |\n' +
        '|------|--------|--------|\n' +
        '| 1 | 100 mod 7 | 100 = 14 × 7 + 2 → 2 |\n' +
        '| 2 | Wednesday + 2 days | Friday |\n' +
        '| 3 | Done | **Friday** |\n\n' +
        '**Check yourself.** It is 22:00 (10 PM). What time will it be 10 hours later? *(22 + 10 = 32. 32 mod 24 = 8. **08:00 the next morning.**)*',
      intermediateContent:
        '**Modular exponentiation by repeated squaring.** Computing 3^100 mod 7 by multiplying 3 by itself 99 times wastes effort. Use the structure of the exponent.\n\n' +
        '**Step 1** — find the cycle of 3 mod 7. Compute 3¹, 3², 3³, ... mod 7:\n\n' +
        '| n | 3ⁿ mod 7 |\n' +
        '|---|----------|\n' +
        '| 1 | 3 |\n' +
        '| 2 | 9 mod 7 = 2 |\n' +
        '| 3 | 6 |\n' +
        '| 4 | 18 mod 7 = 4 |\n' +
        '| 5 | 12 mod 7 = 5 |\n' +
        '| 6 | 15 mod 7 = **1** |\n\n' +
        'The pattern repeats every 6 steps (this is **Fermat\'s Little Theorem**: a^(p−1) ≡ 1 (mod p) for prime p when GCD(a, p) = 1).\n\n' +
        '**Step 2** — reduce 100 mod 6. 100 = 16 × 6 + 4, so 100 mod 6 = 4. Therefore 3^100 ≡ 3⁴ ≡ **4 (mod 7)**.\n\n' +
        '**The Luhn algorithm — credit card validation in your head.** Every credit card number passes this test:\n\n' +
        '| Step | Action |\n' +
        '|------|--------|\n' +
        '| 1 | Starting from the rightmost digit, double every *second* digit |\n' +
        '| 2 | If a doubled digit > 9, subtract 9 |\n' +
        '| 3 | Add all the (possibly modified) digits |\n' +
        '| 4 | The card is valid iff the total is ≡ 0 (mod 10) |\n\n' +
        'A typo in any one digit always changes the sum mod 10, so the error gets caught instantly. Aadhaar numbers, ISBNs, and IBANs use the same idea with different moduli.',
      advancedContent:
        '**RSA encryption — primes and modular arithmetic, hand in glove.**\n\n' +
        '| Step | Action | Math |\n' +
        '|------|--------|------|\n' +
        '| 1 — Setup | Pick two large primes p, q | secret |\n' +
        '| 2 | n = p × q | public |\n' +
        '| 3 | φ(n) = (p − 1)(q − 1) | secret |\n' +
        '| 4 | Public exponent e with GCD(e, φ(n)) = 1 | published, often e = 65537 |\n' +
        '| 5 | Private exponent d satisfying e·d ≡ 1 (mod φ(n)) | computed via extended Euclidean |\n' +
        '| 6 — Encrypt message m | c = m^e mod n | anyone with public key can do this |\n' +
        '| 7 — Decrypt | m = c^d mod n | only the holder of d can |\n\n' +
        'Why it works: by **Euler\'s theorem** (a generalisation of Fermat\'s Little Theorem), `a^φ(n) ≡ 1 (mod n)` for any a coprime to n. So `c^d = m^(e·d) = m^(1 + k·φ(n)) = m × (a^φ(n))ᵏ ≡ m (mod n)`. Decryption recovers the original message.\n\n' +
        '**Why it is secure.** Recovering d from e requires knowing φ(n), which requires knowing p and q. And the only known way to find p and q from n is to factor it. For n with 600+ digits, no classical algorithm can factor in less than millions of years. The entire web\'s security is the hardness of integer factorisation.\n\n' +
        '**The quantum threat.** **Shor\'s algorithm** (1994) factors integers in polynomial time *on a quantum computer*. Today\'s quantum hardware cannot factor the integers used in real RSA — yet. The transition to **post-quantum cryptography** (lattice-based, code-based, hash-based schemes) is well underway because data encrypted today might still need to be secret in 30 years.',
      diagram: 'ModularClockDiagram',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'Euclid proved there are infinitely many primes around 300 BCE — his proof by contradiction is still considered one of the most elegant arguments in all of mathematics.',
            'The largest known prime (as of 2024) is 2^136,279,841 − 1, a number with over 41 million digits. Finding it required years of distributed computing.',
            'The Fibonacci sequence (1, 1, 2, 3, 5, 8, 13, 21...) appears in the spiral patterns of sunflowers, pinecones, and the arrangement of leaves on a bamboo stem.',
            'RSA encryption, which protects online transactions, relies on the fact that multiplying two 300-digit primes takes microseconds, but factoring their product would take millions of years.',
          ],
        },
      },
      practice: practiceModular,
    },
  ],
};
