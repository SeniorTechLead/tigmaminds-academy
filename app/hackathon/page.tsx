import type { Metadata } from 'next';
import HackathonPage from '../../src/views/HackathonPage';
import hackathon from '../../src/data/hackathon.json';

export const metadata: Metadata = {
  title: `${hackathon.title} — Register | TigmaMinds Academy`,
  description: `${hackathon.tagline} ${hackathon.location}. ${hackathon.dates}. Prize pool ${hackathon.prizePool}.`,
};

export default function Page() {
  return <HackathonPage />;
}
