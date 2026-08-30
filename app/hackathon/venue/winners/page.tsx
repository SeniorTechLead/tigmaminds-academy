import type { Metadata } from 'next';
import HackathonVenueWinnersScreen from '../../../../src/views/HackathonVenueWinnersScreen';
import hackathon from '../../../../src/data/hackathon.json';

export const metadata: Metadata = {
  title: `Winners — ${hackathon.title}`,
  description: `Winner and runner-up display for ${hackathon.title}.`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HackathonVenueWinnersScreen />;
}
