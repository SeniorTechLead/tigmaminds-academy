// ============================================================================
//  EDIT THIS FILE, THEN RUN:  npm run build
// ============================================================================
//  Everything you are likely to change lives here. Team members are pulled
//  automatically from ../src/data/hackathon-venue-teams.json using `team`,
//  so you only need to type a team name that exists there. To announce a
//  different team, change `team` below and rebuild.
// ============================================================================

export const awards = {
  winner: {
    team: 'Buri Buri Zaemon',

    // Optional. Leave as '' to hide.
    projectName: '',
    projectTagline: '',

    // Optional team photo. Drop the file in presentation/photos/ and put the
    // filename here, e.g. 'photos/buri-buri-team.jpg'. Ignored if missing.
    photo: '',
  },

  runnerUp: {
    team: 'FineShyft',
    projectName: '',
    projectTagline: '',
    photo: '',
  },

  // Add a third place by filling this in, or set to null to skip the slide.
  secondRunnerUp: null,
  // secondRunnerUp: { team: 'Nexora', projectName: '', projectTagline: '', photo: '' },

  // Optional extra award. Set to null to skip.
  specialMention: null,
  // specialMention: { title: 'Best Use of AI', team: 'Phoenix' },
};

// Optional headshots, keyed by the member name exactly as written in
// hackathon-venue-teams.json (the "(Team Lead)" suffix is optional here).
// Files live in presentation/photos/. Missing files fall back to an
// initials avatar, so it is safe to leave this empty.
export const memberPhotos = {
  // 'Arjun Bora': 'photos/arjun.jpg',
  // 'Moharnab Gogoi': 'photos/moharnab.jpg',
};

// If a team is NOT in hackathon-venue-teams.json, define its members here.
export const extraTeams = {
  // 'Some New Team': [
  //   { name: 'Full Name (Team Lead)', college: 'College Name' },
  // ],
};

export const options = {
  outputName: 'TigmaMinds-Hackathon-2026-Winners',

  // Slides you can switch off if you want a shorter deck.
  includeStatsSlide: true,
  includeJudgingSlide: true,
  includeAllTeamsSlide: true,
  includeSuspenseSlides: true,
  includeThankYouSlide: true,

  // Reveal slides wait for a click before the big name appears. Set to false
  // to make the whole deck play hands-free.
  clickToReveal: true,

  // Also write an animated HTML version next to the .pptx.
  buildHtmlPreview: true,

  logo: '../public/tma-logo.png',
  contactEmail: 'hackathon@tigmaminds.com',
  website: 'tigmaminds.com',
};

export const theme = {
  bg: '0B1226',
  bgAlt: '10193A',
  card: '17204A',
  cardAlt: '1E2A5A',
  line: '2C3A6B',
  gold: 'FFC857',
  goldDark: 'E0A93C',
  goldSoft: 'FFE3A3',
  accent: 'F97316',
  accentSoft: 'FB923C',
  silver: 'C7D2E4',
  bronze: 'CD8B62',
  white: 'FFFFFF',
  muted: '9AA8C7',
  font: 'Segoe UI',
};
