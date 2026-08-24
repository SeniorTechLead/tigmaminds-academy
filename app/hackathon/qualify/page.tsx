import type { Metadata } from 'next';
import HackathonQualifyPage from '../../../src/views/HackathonQualifyPage';
import hackathon from '../../../src/data/hackathon.json';

export const metadata: Metadata = {
  title: `${hackathon.title} — Qualifying Round | TigmaMinds Academy`,
  description: `Qualifying round closed. ${hackathon.location}. ${hackathon.dates}.`,
};

export default function Page() {
  return <HackathonQualifyPage />;
}
