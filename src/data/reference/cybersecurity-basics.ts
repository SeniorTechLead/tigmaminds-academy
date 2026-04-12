import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'cybersecurity-basics',
  title: 'Cybersecurity Basics',
  category: 'electronics',
  icon: '⚙️',
  tagline: 'Passwords, encryption, and staying safe online — the digital self-defense every student needs.',

  understand: [
    {
      title: 'Passwords and Authentication',
      beginnerContent:
        'Your password is the front door to your digital life — email, social media, bank accounts, ' +
        'school portals. Yet the most commonly used passwords worldwide are still "123456" and ' +
        '"password." These can be cracked in less than a second by a computer trying billions of ' +
        'combinations. A strong password is long (at least 12 characters), unpredictable, and unique ' +
        'to each account. A passphrase like "mango-bicycle-monsoon-telescope" is both strong and ' +
        'memorable because its length makes it astronomically hard to guess.\n\n' +
        'But even the best password can be stolen through a data breach (when hackers steal a company\'s ' +
        'database of passwords). That is why *two-factor authentication* (2FA) is essential. With 2FA, ' +
        'logging in requires something you *know* (your password) plus something you *have* (a code ' +
        'from your phone or a hardware key). Even if someone steals your password, they cannot get in ' +
        'without the second factor.\n\n' +
        'A *password manager* (like Bitwarden or 1Password) generates and stores a unique, random ' +
        'password for every account. You remember one master password; the manager handles the rest. ' +
        'This eliminates the temptation to reuse passwords — which is dangerous because if one site ' +
        'gets breached, attackers try that same email-password combination on every other site. Using ' +
        'a password manager with 2FA enabled is the single most impactful thing you can do for your ' +
        'digital security.',
      intermediateContent:
        'The CIA triad: **Confidentiality**, **Integrity**, **Availability**. Common attacks: phishing (91% of breaches), SQL injection, XSS (injecting scripts), MITM (intercepting traffic). Defense: input validation, parameterized queries, HTTPS, CSP headers, MFA. Password strength: entropy = log₂(pool^length). A random 12-character password from 95 printable ASCII characters: entropy = 12 × log₂(95) ≈ 79 bits — would take ~10¹⁶ years to brute force at 10 billion guesses/second.',
      advancedContent:
        'The OWASP Top 10 lists critical risks: Broken Access Control, Cryptographic Failures, Injection, Insecure Design. **Zero-trust** verifies every request. India\'s CERT-In mandates 6-hour breach reporting. MFA types ranked by security: hardware key (FIDO2) > authenticator app (TOTP) > SMS (vulnerable to SIM swap). OAuth 2.0 enables "Sign in with Google" without sharing passwords. JWTs (JSON Web Tokens) carry signed claims — but must be validated server-side and have short expiration to limit damage from theft.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each security concept to its description',
          pairs: [
            ['Two-factor authentication', 'Requires both a password and a second verification step'],
            ['Password manager', 'Generates and stores unique passwords for every account'],
            ['Passphrase', 'A long, memorable password made of multiple words'],
            ['Data breach', 'When hackers steal a company\'s database of user credentials'],
            ['Password reuse', 'Using the same password across multiple sites (dangerous)'],
          ],
        },
      },
    },
    {
      title: 'Encryption: Keeping Secrets Secret',
      beginnerContent:
        'Encryption transforms readable data (called *plaintext*) into scrambled gibberish ' +
        '(*ciphertext*) that only someone with the right key can unscramble. The simplest historical ' +
        'example is the *Caesar cipher*: shift every letter by a fixed number. With a shift of 3, ' +
        '"HELLO" becomes "KHOOR." This is trivially easy to break today, but the principle is the ' +
        'same as modern encryption — just with vastly more complex math.\n\n' +
        '*Symmetric encryption* uses the same key to encrypt and decrypt. It is fast and used for ' +
        'large data, but you need a way to share the key securely. *Asymmetric encryption* (public-key ' +
        'cryptography) uses a pair of keys: a public key that anyone can use to encrypt a message, and ' +
        'a private key that only you have to decrypt it. Imagine a mailbox with a slot — anyone can ' +
        'drop a letter in (public key), but only you have the key to open it (private key).\n\n' +
        'When you visit a website with "https://" in the URL, your browser and the server perform a ' +
        'handshake using asymmetric encryption to agree on a shared symmetric key, then use that fast ' +
        'symmetric key for the rest of the session. This is why HTTPS is so important: without it, ' +
        'anyone on the same network (like public WiFi) can read everything you send and receive — ' +
        'passwords, messages, credit card numbers, everything. Look for the padlock icon in your ' +
        'browser to confirm a site uses HTTPS.',
      intermediateContent:
        'Symmetric encryption (AES-256): same key for encrypt/decrypt. 14 rounds of substitution and mixing on 128-bit blocks. Brute-forcing 2²⁵⁶ keys: impossible. Asymmetric (RSA): public key encrypts, private decrypts. Password hashing: bcrypt/argon2 use deliberately slow functions (100ms+) with unique salts. HTTPS uses TLS: asymmetric encryption exchanges a symmetric session key, then symmetric encrypts the actual data (faster). The padlock icon in your browser means this handshake succeeded.',
      advancedContent:
        'Post-quantum cryptography: NIST selected CRYSTALS-Kyber (lattice-based key exchange) and Dilithium (signatures). **Homomorphic encryption** computes on encrypted data — enabling privacy-preserving analytics. **Zero-knowledge proofs** prove knowledge without revealing it (used in crypto privacy, potential for age verification). End-to-end encryption (Signal protocol, WhatsApp) ensures only sender and receiver can read messages — even the service provider cannot decrypt. Forward secrecy generates unique session keys so past communications remain secure even if long-term keys are later compromised.',
    },
    {
      title: 'Common Threats: Phishing, Malware, and Social Engineering',
      beginnerContent:
        '*Phishing* is the most common cyberattack, and it targets humans, not computers. You receive ' +
        'an email or message that looks legitimate — perhaps from your bank, school, or a popular ' +
        'service — asking you to click a link and enter your login credentials. The link leads to a ' +
        'fake website that looks identical to the real one. Once you type your password, the attacker ' +
        'has it. Phishing works because it exploits trust and urgency ("Your account will be locked ' +
        'in 24 hours!"). Always check the actual URL before entering credentials, and be suspicious ' +
        'of any message that pressures you to act immediately.\n\n' +
        '*Malware* (malicious software) includes viruses, ransomware, and spyware. Ransomware encrypts ' +
        'all your files and demands payment to unlock them — hospitals and city governments have been ' +
        'paralyzed by ransomware attacks. Malware usually enters through email attachments, pirated ' +
        'software, or compromised websites. Keeping your operating system and apps updated is one of ' +
        'the best defenses, because updates patch the security holes that malware exploits.\n\n' +
        '*Social engineering* is the broader category: manipulating people into giving up confidential ' +
        'information. It might be a phone call from someone pretending to be IT support asking for your ' +
        'password, or a USB drive labeled "Employee Salaries" left in a parking lot (curiosity makes ' +
        'people plug it in, and it installs malware). The common thread is that attackers exploit human ' +
        'psychology — trust, fear, curiosity, helpfulness — rather than technical vulnerabilities.',
      intermediateContent:
        'Phishing emails mimic legitimate senders — check the actual sender address (not display name), hover over links before clicking, be suspicious of urgency ("Your account will be closed in 24 hours!"). **Malware** types: virus (attaches to programs, requires user action), worm (self-propagating across networks), trojan (disguised as legitimate software), ransomware (encrypts files, demands payment). Defense: keep software updated (patches fix known vulnerabilities), use antivirus, don\'t download from untrusted sources, enable automatic updates.',
      advancedContent:
        'Social engineering exploits human psychology rather than technical vulnerabilities. **Pretexting** (creating a fake scenario to extract information), **baiting** (leaving infected USB drives in parking lots), **tailgating** (following authorized personnel through secure doors), and **vishing** (phone phishing) all bypass technical defenses. Defense requires security awareness training — organizations that conduct regular simulated phishing exercises reduce click rates from ~30% to ~5%. The weakest link in any security system is usually human behavior, which is why security culture matters more than technology alone.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each threat to the correct defense',
          pairs: [
            ['Phishing email', 'Check the actual URL before clicking or entering credentials'],
            ['Ransomware', 'Keep regular backups and update your software'],
            ['Social engineering call', 'Verify the caller\'s identity through an official channel'],
            ['Malware from downloads', 'Only install software from trusted, official sources'],
          ],
        },
      },
    },
    {
      title: 'Staying Safe Online',
      beginnerContent:
        'Public WiFi at cafes, airports, and hotels is convenient but risky. On an unsecured network, ' +
        'anyone nearby can potentially intercept your traffic. If the site does not use HTTPS, they can ' +
        'read everything. Even with HTTPS, attackers can see which websites you visit. A *VPN* (Virtual ' +
        'Private Network) encrypts all your traffic between your device and the VPN server, creating a ' +
        'secure tunnel even on untrusted networks. If you regularly use public WiFi, a reputable VPN ' +
        'is a worthwhile investment.\n\n' +
        'Software updates are not just about new features — they often fix security vulnerabilities. ' +
        'When a company discovers a flaw, they release a patch. Attackers know this too, and they race ' +
        'to exploit the flaw before people update. Delaying updates is like leaving your door unlocked ' +
        'after the locksmith told you the lock is broken. Enable automatic updates on your phone, ' +
        'computer, and apps.\n\n' +
        'Finally, be thoughtful about your *privacy settings*. Social media platforms default to sharing ' +
        'as much as possible — your location, your contacts, your browsing habits — because that data ' +
        'is valuable for advertising. Review the privacy settings on every app and platform you use. ' +
        'Turn off location sharing unless an app genuinely needs it. Limit who can see your posts and ' +
        'profile information. Think of personal data as currency: do not hand it out for free unless ' +
        'you understand the trade-off.',
      intermediateContent:
        'Password best practices: use a password manager (Bitwarden, 1Password), generate unique 16+ character passwords for each site, enable 2FA everywhere (authenticator app > SMS). Personal data hygiene: minimize information shared on social media (birthdate, mother\'s maiden name — common security questions), use privacy-focused search engines and browsers, review app permissions regularly. Network safety: avoid public WiFi for sensitive transactions (or use a VPN), verify HTTPS before entering credentials, log out of shared computers.',
      advancedContent:
        'Threat modeling identifies what you need to protect, from whom, and the consequences of failure. For a student: protect social media accounts (reputation), email (password resets), and school accounts (grades). For a developer: protect source code (IP theft), API keys (unauthorized access), and user data (legal liability). Defense in depth layers multiple protections: strong passwords + 2FA + encrypted storage + regular backups + network monitoring. The principle of least privilege grants only the minimum access needed — don\'t run everyday tasks as administrator, don\'t give apps permissions they don\'t need.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Public WiFi is completely safe as long as you have a strong password on your account.', answer: false, explanation: 'A strong password protects your account, but on public WiFi, unencrypted traffic can still be intercepted. Use HTTPS and a VPN for protection.' },
            { text: 'Software updates often contain important security patches, not just new features.', answer: true, explanation: 'Many updates fix vulnerabilities that attackers are actively trying to exploit. Delaying updates leaves you exposed.' },
            { text: 'A VPN encrypts your internet traffic, protecting it even on untrusted networks.', answer: true, explanation: 'A VPN creates an encrypted tunnel between your device and the VPN server, preventing eavesdropping on the local network.' },
            { text: 'If a website has a padlock icon in the browser, it is guaranteed to be trustworthy and safe.', answer: false, explanation: 'The padlock means the connection is encrypted (HTTPS), but it does not verify the site\'s trustworthiness. Phishing sites can have HTTPS too.' },
          ],
        },
      },
    },
  ],
};
