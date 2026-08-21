export interface HackathonJudgingCriterion {
  criteria: string;
  weightage: string;
}

export interface HackathonPrizes {
  totalPool: string;
  categories: string[];
}

export interface HackathonQualifyingRound {
  title: string;
  intro: string;
}

export interface HackathonDetails {
  slug: string;
  title: string;
  tagline: string;
  location: string;
  dates: string;
  registrationCloses: string;
  registrationClosesAt: string;
  teamSize: string;
  duration: string;
  venue: string;
  eligibility: string;
  prizePool: string;
  format: string;
  organizedBy: string;
  eventCategory: string;
  modeOfConduct: string[];
  developmentObjective: string;
  theme: string;
  whatYouCanBuild: string[];
  certificates: string;
  goodiesAndMentorship: string;
  finalEvaluation: string;
  prizes: HackathonPrizes;
  judgingCriteria: HackathonJudgingCriterion[];
  registrationOpen: boolean;
  minTeamSize: number;
  maxTeamSize: number;
  notifyEmail: string;
  qualifyingRound: HackathonQualifyingRound;
}

export interface HackathonMember {
  name: string;
  email: string;
  phone: string;
  institution: string;
  eligibility: string;
  gender: string;
  tshirtSize: string;
  isLead: boolean;
}

export interface HackathonRegistration {
  id: string;
  teamName: string;
  members: HackathonMember[];
  ideaSummary?: string;
  createdAt: string;
}
