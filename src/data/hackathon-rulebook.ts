export interface HackathonRuleSection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
  subsections?: {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
  }[];
  note?: string;
}

export const HACKATHON_RULEBOOK_TITLE = 'TigmaMinds Academy Hackathon 2026';
export const HACKATHON_RULEBOOK_SUBTITLE = 'Official Rulebook';

export const HACKATHON_RULEBOOK_CONTACT = {
  organization: 'TigmaMinds Academy',
  email: 'hackathon@tigmaminds.com',
  websiteLabel: 'TigmaMinds Academy — Learn STEM Through Stories',
  websiteUrl: 'https://tigmaminds.academy',
  phone: '9395684834',
};

export const HACKATHON_RULEBOOK_SECTIONS: HackathonRuleSection[] = [
  {
    id: 'introduction',
    title: '1. Introduction',
    paragraphs: [
      'The TigmaMinds Academy Hackathon 2026 is a two-stage software innovation competition designed to encourage students and recent graduates to develop innovative solutions for real-world challenges. Participants will compete by designing and building functional software prototypes within a limited time frame while demonstrating creativity, technical excellence, and teamwork.',
    ],
  },
  {
    id: 'event-overview',
    title: '2. Event Overview',
    table: {
      headers: ['Item', 'Details'],
      rows: [
        ['Event', 'TigmaMinds Academy Hackathon 2026'],
        ['Organizer', 'TigmaMinds Academy'],
        ['Location', 'Guwahati, Assam'],
        ['Mode', 'Online Qualifier + Offline Grand Finale'],
        ['Format', 'In-Person (Final Round)'],
        ['Duration', '48 Hours'],
        ['Theme', 'Software Innovation'],
        ['Event Category', 'Prototype & Product Development'],
        ['Date', '29th and 30th August 2026'],
        ['Venue', 'Guwahati'],
      ],
    },
  },
  {
    id: 'eligibility',
    title: '3. Eligibility',
    paragraphs: ['The hackathon is open to:'],
    bullets: [
      'Undergraduate (UG) students',
      'Postgraduate (PG) students',
      'Fresh graduates',
      'Recent pass-outs',
      'Participants must possess a valid college/university ID or proof of graduation.',
    ],
  },
  {
    id: 'team-formation',
    title: '4. Team Formation',
    bullets: [
      'Each team must consist of 2 to 4 members.',
      'Participants may be from the same or different academic years.',
      'Each participant may be a member of only one team.',
      'Team composition cannot be changed after the registration deadline except with approval from the organizing committee.',
    ],
  },
  {
    id: 'registration',
    title: '5. Registration',
    bullets: [
      'Registration is mandatory.',
      'Registration closes on 23 August 2026.',
    ],
  },
  {
    id: 'competition-format',
    title: '6. Competition Format',
    subsections: [
      {
        title: 'Round 1 – Online Qualifier',
        bullets: [
          'Registered teams will receive a problem statement.',
          'Teams will have a specified duration to develop and submit a working prototype.',
          'Submission requirements include: Source Code, README, Project Presentation (PPT/PDF), and Demo Video (3–5 minutes).',
          'The evaluation committee will shortlist teams for the final round.',
        ],
        paragraphs: ['Only shortlisted teams will qualify for the Grand Finale.'],
      },
      {
        title: 'Round 2 – Offline Grand Finale',
        paragraphs: [
          'Qualified teams will participate in a 48-hour in-person hackathon in Guwahati.',
          'During the final round:',
        ],
        bullets: [
          'Teams will build or enhance their solution.',
          'Mentors will be available for technical guidance.',
          'Final evaluation will be conducted by an expert judging panel.',
          'Winners will be announced during the closing ceremony.',
        ],
      },
    ],
  },
  {
    id: 'theme',
    title: '7. Hackathon Theme',
    paragraphs: [
      'The detailed problem statement will be shared only with teams that qualify for the final round.',
      'Participants are expected to develop innovative software-based solutions capable of addressing practical challenges.',
    ],
  },
  {
    id: 'what-you-can-build',
    title: '8. What Participants Can Build',
    paragraphs: ['Teams may develop:'],
    bullets: [
      'Web Applications',
      'Mobile Applications',
      'AI/ML Solutions',
      'SaaS Products',
      'Enterprise Applications',
      'Cloud-Based Applications',
      'Developer Tools',
      'Innovative Software Prototypes',
    ],
    note: 'Hardware projects are not mandatory unless explicitly specified in the problem statement.',
  },
  {
    id: 'technology-stack',
    title: '9. Technology Stack',
    paragraphs: [
      'Participants are free to choose any technology stack, programming language, framework, or cloud platform.',
      'Examples include: Java, Python, JavaScript, TypeScript, C#, Go, Rust, Node.js, Spring Boot, .NET, React, Angular, Flutter, React Native, Next.js, PostgreSQL, MongoDB, MySQL, Firebase, AWS, Azure, and Google Cloud.',
    ],
  },
  {
    id: 'development-rules',
    title: '10. Development Rules',
    paragraphs: ['Teams must adhere to the following:'],
    bullets: [
      'Development should primarily take place during the hackathon.',
      'Public open-source libraries and frameworks are allowed.',
      'AI development tools (such as GitHub Copilot, ChatGPT, Gemini, Claude, etc.) may be used as coding assistants.',
      'Teams must understand and be able to explain every part of their solution.',
      'Plagiarism or copying another team\'s work is strictly prohibited.',
      'Previously developed projects are not permitted unless explicitly approved by the organizers.',
      'Any third-party assets or datasets used must comply with their respective licenses.',
    ],
  },
  {
    id: 'submission-requirements',
    title: '11. Submission Requirements',
    paragraphs: ['Each team must submit:'],
    bullets: [
      'Source Code (Git repository)',
      'README',
      'Installation Guide',
      'Architecture Diagram',
      'Presentation Deck (PDF/PPT)',
      'Demo Video (if requested)',
      'List of Technologies Used',
    ],
    note: 'Failure to submit mandatory documents may result in disqualification.',
  },
  {
    id: 'judging-criteria',
    title: '12. Judging Criteria',
    table: {
      headers: ['Criteria', 'Weightage'],
      rows: [
        ['Innovation & Creativity', '25%'],
        ['Technical Implementation', '25%'],
        ['Problem Solving & Impact', '20%'],
        ['Functionality / Prototype', '20%'],
        ['Presentation & Demo', '10%'],
      ],
    },
    note: "The judges' decision shall be final and binding.",
  },
  {
    id: 'ip',
    title: '13. Code Ownership & Intellectual Property',
    bullets: [
      'Teams retain ownership of their intellectual property.',
      'Participants grant TigmaMinds Academy the right to showcase project summaries, screenshots, and demo videos for promotional and educational purposes.',
      'Teams must ensure that submitted work does not infringe upon any third-party intellectual property rights.',
    ],
  },
  {
    id: 'code-of-conduct',
    title: '14. Code of Conduct',
    paragraphs: ['Participants are expected to:'],
    bullets: [
      'Maintain professionalism throughout the event.',
      'Treat fellow participants, mentors, judges, volunteers, and organizers with respect.',
      'Follow venue rules and safety guidelines.',
      'Avoid disruptive, offensive, or inappropriate behavior.',
      'Respect academic integrity and fair competition.',
    ],
    note: 'Any misconduct may result in immediate disqualification.',
  },
  {
    id: 'disqualification',
    title: '15. Disqualification',
    paragraphs: ['Teams may be disqualified for:'],
    bullets: [
      'Plagiarism or intellectual property violations.',
      'False information during registration.',
      'Submission of previously completed projects.',
      'Violation of hackathon rules.',
      'Unethical behaviour.',
      'Failure to comply with organizer instructions.',
    ],
  },
  {
    id: 'mentorship',
    title: '16. Mentorship',
    paragraphs: [
      'Throughout the hackathon, industry experts and mentors will be available to:',
    ],
    bullets: [
      'Clarify the problem statement.',
      'Provide technical guidance.',
      'Offer architectural suggestions.',
      'Help teams overcome development challenges.',
    ],
    note: 'Mentors will not contribute code or directly build project components.',
  },
  {
    id: 'awards',
    title: '17. Awards',
    paragraphs: [
      'Total Prize Pool: Up to ₹1,00,000/-',
      'Awards include:',
    ],
    bullets: [
      'Winner',
      'Runner-Up',
      'Special Category Awards (subject to organizer discretion)',
    ],
    note: 'Prize distribution may vary depending on sponsorships and participation.',
  },
  {
    id: 'certificates',
    title: '18. Certificates',
    paragraphs: ['All eligible participants will receive:'],
    bullets: [
      'Participation Certificate',
      'Mentor Appreciation Certificates (for invited mentors)',
    ],
    note: 'Certificates will be issued only to participants who complete the event in accordance with the rules.',
  },
  {
    id: 'goodies',
    title: '19. Goodies',
    paragraphs: ['Participants may receive:'],
    bullets: [
      'Event T-shirts (subject to availability)',
      'Welcome Kit',
      'Stickers',
      'Swag',
      'Refreshments during the event',
    ],
  },
  {
    id: 'organizer-rights',
    title: '20. Organizer Rights',
    paragraphs: ['TigmaMinds Academy reserves the right to:'],
    bullets: [
      'Modify the schedule if required.',
      'Update rules before the event.',
      'Change venue or dates due to unforeseen circumstances.',
      'Disqualify participants violating the rules.',
      'Cancel or postpone the event if necessary.',
    ],
    note: 'Any updates will be communicated through official channels.',
  },
  {
    id: 'contact',
    title: '21. Contact',
    paragraphs: [
      'TigmaMinds Academy',
      `Email: ${HACKATHON_RULEBOOK_CONTACT.email}`,
      `Website: ${HACKATHON_RULEBOOK_CONTACT.websiteLabel}`,
      `Phone: ${HACKATHON_RULEBOOK_CONTACT.phone}`,
      'We look forward to welcoming passionate innovators to the TigmaMinds Academy Hackathon 2026. Build, innovate, collaborate, and create solutions that make an impact!',
    ],
  },
];
