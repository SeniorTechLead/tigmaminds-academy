import hackathon from './hackathon.json';

/** Registration is open when the flag is true and the close datetime has not passed. */
export function isHackathonRegistrationOpen(now = new Date()): boolean {
  if (!hackathon.registrationOpen) return false;
  const closesAt = new Date(hackathon.registrationClosesAt);
  if (Number.isNaN(closesAt.getTime())) return hackathon.registrationOpen;
  return now.getTime() <= closesAt.getTime();
}
