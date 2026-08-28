import type { Metadata } from 'next';
import HackathonVenueTeamsScreen from '../../../../src/views/HackathonVenueTeamsScreen';
import hackathon from '../../../../src/data/hackathon.json';

export const metadata: Metadata = {
  title: `Participating Teams — ${hackathon.title}`,
  description: `Venue display of participating teams for ${hackathon.title}.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HackathonVenueTeamsScreen />;
}
